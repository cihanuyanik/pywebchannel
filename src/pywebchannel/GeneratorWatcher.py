import importlib.util
import inspect
import io
import os
import sys
from typing import Optional, List, Dict

from PySide6.QtCore import QObject, QFileSystemWatcher, QDir, QFileInfo

from pywebchannel.CodeAnalyzer import Interface, CodeAnalyzer
from pywebchannel.Utils import Logger, Utils, Generator


class GeneratorWatcher(QFileSystemWatcher):
    """A class that inherits from QFileSystemWatcher and watches for changes in python files.

    Attributes:
        watchTargetDirMap (Dict[str, str]): A dictionary that maps the source directory to the target directory.
    """

    def __init__(self, parent: Optional[QObject] = None):
        """The constructor method for the GeneratorWatcher class.

        Args:
            parent (Optional[QObject], optional): The parent object of the GeneratorWatcher. Defaults to None.
        """
        # Call the super constructor
        super().__init__(parent)
        # Connect the signals to the slots
        self.directoryChanged.connect(self.onDirectoryChanged)
        self.fileChanged.connect(self.onFileChanged)
        # Initialize the watchTargetDirMap attribute
        self.watchTargetDirMap: Dict[str, str] = {}

    def onDirectoryChanged(self, dirPath: str):
        """The slot that is triggered when a directory is changed.

        Args:
            dirPath (str): The path of the changed directory.
        """
        # Create a QDir object from the dirPath
        directory = QDir(dirPath)
        # Get the list of python files in the directory
        pythonFiles = self._getPythonFiles(directory)
        # Get the list of watch files in the directory
        watchFiles = self._getWatchFilesIn(directory)

        # Loop through the python files
        for pFile in pythonFiles:
            try:
                # Check if the file is already in the watch list
                watchFiles.index(pFile)
            except ValueError:
                # If not, add the file to the watch list
                self.addFile(pFile)

    def onFileChanged(self, filePath: str):
        """The slot that is triggered when a file is changed.

        Args:
            filePath (str): The path of the changed file.
        """
        # Create a QFileInfo object from the filePath
        file = QFileInfo(filePath)
        # Check if the file exists
        if not file.exists():
            # If not, delete the corresponding typescript file
            self._delete_typescript(filePath)
        else:
            # If yes, update the corresponding typescript file
            self._update_typescript(filePath)

    def addDirectory(self, dirPathToWatch: str, dirTargetPath: str):
        """A method that adds a directory to the watch list.

        Args:
            dirPathToWatch (str): The path of the directory to watch.
            dirTargetPath (str): The path of the target directory to generate typescript files.
        """
        # Create a QDir object from the dirPathToWatch
        directory = QDir(dirPathToWatch)
        # Get the absolute path of the directory
        absPath = directory.absolutePath()

        # Create a QDir object from the dirTargetPath
        targetDirectory = QDir(dirTargetPath)
        # Get the absolute path of the target directory
        targetAbsPath = targetDirectory.absolutePath()

        # Check if the directory to watch exists
        if not directory.exists():
            # If not, log an error message
            Logger.error(f"Watch Directory '{absPath}' does not exist")
            return

        # Check if the target directory exists
        if not targetDirectory.exists():
            # If not, log an error message
            Logger.error(f"Target Directory '{targetAbsPath}' does not exist")
            return

        # Check if the directory to watch is already in the watch list
        if self.directories().count(absPath) > 0:
            # If yes, log a warning message
            Logger.warning(f"Directory, '{absPath}', is already in watch list")
            return

        # Try to add the directory to the watch list
        if not self.addPath(absPath):
            # If failed, log a warning message
            Logger.warning(f"Directory, '{absPath}', could not added into watch list")
            return

        # If succeeded, log an info message
        Logger.info(f"Directory '{absPath}' added into watch list")

        # Add the directory to the watchTargetDirMap attribute
        self.watchTargetDirMap[absPath] = targetAbsPath

        # Add files in the directory to the watch list
        for pFile in self._getPythonFiles(directory):
            self.addFile(pFile)

    def addFile(self, filePath: str):
        """A method that adds a file to the watch list.

        Args:
            filePath (str): The path of the file to watch.
        """
        # Create a QFileInfo object from the filePath
        file = QFileInfo(filePath)

        # Check if the file exists
        if not file.exists():
            # If not, log an error message
            Logger.error(f"File '{filePath}' does not exist")
            return

        # Check if the file is already in the watch list
        if self.files().count(file.absoluteFilePath()) > 0:
            # If yes, log a warning message
            Logger.warning(f"File, '{filePath}', is already in watch list")
            return

        # Try to add the file to the watch list
        if not self.addPath(file.absoluteFilePath()):
            # If failed, log a warning message
            Logger.warning(f"File, '{filePath}', could not added into watch list")
            return

        # If succeeded, log an info message
        Logger.info(f"File '{filePath}' added into watch list")
        # Trigger the onFileChanged slot
        self.onFileChanged(filePath)

    def _getWatchFilesIn(self, directory: QDir) -> List[str]:
        """A helper method that returns the list of watch files in a directory.

        Args:
            directory (QDir): The directory to search.

        Returns:
            List[str]: The list of watch files in the directory.
        """
        # Get the absolute path of the directory
        dirPath = directory.absolutePath()

        # Initialize an empty list
        files = []
        # Loop through the watch files
        for file in self.files():
            # Check if the file starts with the directory path
            if file.startswith(dirPath):
                # If yes, append the file to the list
                files.append(file)

        # Return the list
        return files

    @staticmethod
    def _getPythonFiles(directory: QDir) -> List[str]:
        """A helper method that returns the list of python files in a directory.

        Args:
            directory (QDir): The directory to search.

        Returns:
            List[str]: The list of python files in the directory.
        """
        # Get the list of files that match the "*.py" filter
        pythonFiles = directory.entryList(["*.py"])
        # Try to remove the "__init__.py" and "ControllerBase.py" files from the list
        try:
            pythonFiles.remove("__init__.py")
            pythonFiles.remove("ControllerBase.py")
        except ValueError:
            # If failed, ignore the exception
            pass

        # Loop through the list of python files
        for i in range(0, len(pythonFiles)):
            # Prepend the absolute path of the directory to the file name
            pythonFiles[i] = f"{directory.absolutePath()}/{pythonFiles[i]}"

        # Return the list
        return pythonFiles

    # This is a module that converts Python code to TypeScript code
    # It uses importlib, inspect, os, io, and sys modules
    # It also uses Logger, CodeAnalyzer, Generator, Interface, and Utils classes

    def getOutputFilePath(self, filePath):
        """Get the output file path for the TypeScript file.

        Args:
            filePath (str): The input file path for the Python file.

        Returns:
            str: The output file path for the TypeScript file.
        """
        # Find the position of the last slash in the file path
        pos = filePath.rfind("/")
        # Get the source folder and the source name from the file path
        sourceFolder = filePath[0:pos]
        sourceName = filePath[pos + 1:]

        # Check if the source folder is in the watch target directory map
        if sourceFolder in self.watchTargetDirMap:
            # Get the target folder from the map
            targetFolder = self.watchTargetDirMap[sourceFolder]
        else:
            # Log a warning message and use the source folder as the target folder
            Logger.warning(f"No target folder mapped for '{sourceFolder}'")
            targetFolder = sourceFolder

        # Replace the .py extension with .ts for the target source name
        targetSourceName = sourceName.replace(".py", ".ts")

        # Return the target folder and the target source name as the output file path
        return targetFolder + "/" + targetSourceName

    def _delete_typescript(self, filePath: str):
        """Delete the TypeScript file corresponding to the Python file.

        Args:
            filePath (str): The input file path for the Python file.
        """
        # Get the output file path for the TypeScript file
        outputFile = self.getOutputFilePath(filePath)
        # Check if the output file exists
        if os.path.exists(outputFile):
            # Delete the output file
            os.remove(outputFile)
            # Log an info message
            Logger.info(f"Typescript file, {outputFile} has been deleted")

    @staticmethod
    def __get_members(filePath: str):
        """Get the members from the Python file.

        Args:
            filePath (str): The input file path for the Python file.

        Returns:
            list: A list of tuples of member names and objects.
        """
        # Load the module with a custom name from the absolute path
        spec = importlib.util.spec_from_file_location("MODULE_NAME", filePath)
        module = importlib.util.module_from_spec(spec)
        sys.modules["MODULE_NAME"] = module
        spec.loader.exec_module(module)

        # Get all the members from the loaded module
        members = inspect.getmembers(module)

        # Filter them out, only keep the classes from the same file
        members_in_file = []
        for i in range(len(members)):
            # noinspection PyBroadException
            try:
                name, member = members[i]

                # Check if the member belongs to the custom module
                if member.__module__ == "MODULE_NAME":
                    # Add the member to the list
                    members_in_file.append(members[i])
            except Exception:
                # Ignore any exceptions
                pass

        # Return the list of members in the file
        return members_in_file

    def _update_typescript(self, filePath: str):
        """Update the TypeScript file corresponding to the Python file.

        Args:
            filePath (str): The input file path for the Python file.
        """
        # Initialize an empty dictionary for the interface map
        interfaceMap: Dict[str, Interface] = {}
        # Initialize an empty list for the dependencies
        deps = []

        # Loop through the members in the file
        for memberName, MetaClass in self.__get_members(filePath):
            # Create a code analyzer object for the member
            analyzer = CodeAnalyzer(MetaClass)
            # Check if the member is acceptable for conversion
            if analyzer.isAcceptable():
                # Run the analyzer and get the interface object
                interfaceMap[memberName] = analyzer.run()
                # Extend the dependencies list with the interface dependencies
                deps.extend(interfaceMap[memberName].dependencies())
            else:
                # Log a warning message for the unprocessable member
                Logger.warning(
                    f"The class/function, '{memberName}' cannot be processed. It must be a class derived from "
                    f"'Controller' or 'BaseModel' from Pydantic"
                )

        # Remove the duplicate dependencies
        deps = list(dict.fromkeys(deps))

        # Remove the TypeScript primitives from the dependencies
        deps = [*filter(lambda d: not Utils.isTypescriptPrimitive(d), deps)]

        # Remove the dependencies that are already in the same file
        deps = [*filter(lambda d: d not in interfaceMap, deps)]

        # Generate the TypeScript code header
        header = Generator.header()
        # Generate the TypeScript code imports
        imports = Generator.imports(deps)
        # Initialize an empty dictionary for the interface lines
        interfaceLines: Dict[str, list[str]] = dict()
        # Loop through the interface map
        for name, interface in interfaceMap.items():
            # Generate the TypeScript code interface
            interfaceLines[name] = Generator.interface(name, interface)

        # Combine the header, imports, and interface lines
        codeLines = [*header, *imports]
        for name, interface in interfaceLines.items():
            codeLines.extend(interface)

        # Get the output file path for the TypeScript file
        outputFile = self.getOutputFilePath(filePath)

        # Write the TypeScript code into the output file
        with io.open(outputFile, mode="w") as f:
            f.write("\n".join(codeLines))

        # Log an info message
        Logger.info(f"Conversion completed and written into '{outputFile}'")
