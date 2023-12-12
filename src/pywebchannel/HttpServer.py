from PySide6.QtCore import QObject, QProcess, Slot

from pywebchannel.Utils import Logger


# A class that represents an HTTP server
class HttpServer(QObject):
    """A class that inherits from QObject and runs an HTTP server using QProcess.

    Attributes:
        process (QProcess): The QProcess object that executes the HTTP server.
        port (int): The port number for the HTTP server.
        serverDir (str): The directory path for the HTTP server.
    """

    def __init__(self, serverDir: str, port: int, parent=None) -> None:
        """Initializes the HttpServer object with the given parameters.

        Args:
            serverDir (str): The directory path for the HTTP server.
            port (int): The port number for the HTTP server.
            parent (QObject, optional): The parent object for the HttpServer. Defaults to None.
        """
        # Call the superclass constructor
        super().__init__(parent)
        # Create a QProcess object with the parent
        self.process = QProcess(parent)
        # Assign the port number
        self.port = port
        # Assign the server directory
        self.serverDir = serverDir
        # Connect the readyReadStandardOutput signal to the onReadyReadStandardOutput slot
        # noinspection PyUnresolvedReferences
        self.process.readyReadStandardOutput.connect(
            self.onReadyReadStandardOutput)
        # Connect the readyReadStandardError signal to the onReadyReadStandardError slot
        # noinspection PyUnresolvedReferences
        self.process.readyReadStandardError.connect(
            self.onReadyReadStandardError)
        # Connect the aboutToQuit signal of the parent to the stop slot
        self.parent().aboutToQuit.connect(self.stop)

    def start(self) -> None:
        """Starts the HTTP server using the QProcess object.

        The QProcess object executes the command "python -m http.server port --directory serverDir".
        """
        # Start the QProcess with the command and arguments
        self.process.start("python", ["-m", "http.server", f"{self.port}",
                                      "--directory", self.serverDir])

    @Slot()
    def stop(self) -> None:
        """Stops the HTTP server by killing the QProcess object.

        Logs the information of stopping the HTTP server using the Logger object.
        """
        # Log the information of stopping the HTTP server
        Logger.info("Stopping http server", "HttpServer")
        # Kill the QProcess object
        self.process.kill()

    @Slot()
    def onReadyReadStandardOutput(self) -> None:
        """Reads the standard output from the QProcess object and logs it using the Logger object.

        This slot is invoked when the QProcess object emits the readyReadStandardOutput signal.
        """
        # Log the status of the standard output
        Logger.status(
            self.process.readAllStandardOutput().toStdString(), "HttpServer")

    @Slot()
    def onReadyReadStandardError(self) -> None:
        """Reads the standard error from the QProcess object and logs it using the Logger object.

        This slot is invoked when the QProcess object emits the readyReadStandardError signal.
        """
        # Log the status of the standard error
        Logger.status(
            self.process.readAllStandardError().toStdString(), "HttpServer")
