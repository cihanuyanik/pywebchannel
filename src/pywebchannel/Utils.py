import inspect
import pprint
import sys
from datetime import datetime
from inspect import signature

import colorama
from colorama import Fore, Back


class Utils:
    """A class that provides some utility methods for working with types and signatures.
    """

    # Define a dictionary that maps Python types to TypeScript types
    VARIABLE_TYPE_MAP = dict(
        {
            # string(s)
            "str": "string",
            "QString": "string",
            # number(s)
            "int": "number",
            "float": "number",
            "double": "number",
            # boolean(s)
            "bool": "boolean",
            # void
            "void": "void",
            # extras
            "Response": "Response",
            "any": "any",
            "dict": "any",
            "list": "any[]",
            "QVariantMap": "any",
            "QVariantList": "any[]",
        }
    )

    # Create a pretty printer object for formatting output
    pp = pprint.PrettyPrinter(indent=4)

    @staticmethod
    def getInheritanceTree(T: type):
        """Returns a dictionary that represents the inheritance tree of a given type.

        Args:
            T: A type object that represents the subclass.

        Returns: A dictionary that maps the names of the base classes to their type objects, starting from the
        subclass to the object class.
        """

        def inner(t: type, output: dict):
            """A helper function that recursively adds the base classes to the output dictionary.

            Args:
                t: A type object that represents the current subclass.
                output: A dictionary that stores the inheritance tree.
            """
            # Get the list of base classes for the given subclass
            inheritList = inspect.getclasstree([t])
            # Get the first base class from the list
            baseType = inheritList[0][0]
            # print(baseType.__name__)
            # Add the base class name and type object to the output dictionary
            output[baseType.__name__] = baseType
            # If the base class is not the object class
            if baseType != object:
                # Recursively call the inner function with the base class as the new subclass
                inner(baseType, output)

        # Create an empty dictionary to store the inheritance tree
        treeMap = dict()
        # Call the inner function with the given subclass and the empty dictionary
        inner(T, treeMap)

        # Return the filled dictionary
        return treeMap

    @staticmethod
    def type_to_string(t: type):
        """Returns a string representation of a given type.

        Args:
            t: A type object that represents the type to be converted.

        Returns:
            A string that represents the type, with the format 'list[<type>]' for list types.
        """
        # If the type is a list type
        if t.__name__.lower() == "list":
            # Return the string representation of the list type with the element type
            return f"list[{Utils.type_to_string(t.__args__[0])}]"
        else:
            # Return the name of the type
            return t.__name__

    @staticmethod
    def simplyVariableType(text: str) -> str:
        """Simplifies a str representation of a type by removing whitespace, quotation marks, and package information.

        Args:
            text: A string that represents the type to be simplified.

        Returns:
            A simplified string that represents the type, with the format 'list[<type>]' for list types.
        """
        # Clear white space and unnecessary symbols
        text = text.strip(" '")

        # Check if the type is a list type and get the prefix
        _isList, _listPrefix = Utils.isList(text)

        # If the type is a list type
        if _isList:
            # Remove the prefix from the type
            text = text.removeprefix(_listPrefix)
            # Remove the closing bracket from the type
            text = text.removesuffix("]")
            # Recursively simplify the element type and add the brackets
            return f"list[{Utils.simplyVariableType(text)}]"
        else:
            # Remove package information and keep only last part
            text = text.split(".")[-1]
            # Return the simplified type
            return text

    @staticmethod
    def isList(text: str) -> tuple[bool, str]:
        """Checks if a string representation of a type is a list type.

        Args:
            text: A string that represents the type to be checked.

        Returns:
            A tuple of a boolean value and a string prefix. The boolean value is True if the type is a list
            type, and False otherwise. The string prefix is either list[ or List[ depending on the case of the type,
            or an empty string if the type is not a list type.
        """
        # If the type starts with list[
        if text.startswith("list["):
            # Return True and the prefix list[
            return True, "list["

        # If the type starts with List[
        if text.startswith("List["):
            # Return True and the prefix List[
            return True, "List["

        # If the type does not start with either prefix
        # Return False and an empty string
        return False, ""

    @staticmethod
    def isTypescriptPrimitive(text: str) -> bool:
        """Checks if a string representation of a type is a TypeScript primitive type.

        Args:
            text: A string that represents the type to be checked.

        Returns:
            A boolean value that is True if the type is a TypeScript primitive type, and False otherwise.
        """
        # Return True if the type is in the set of TypeScript primitive types, and False otherwise
        return text in ("string", "boolean", "number", "void")

    @staticmethod
    def convertType(text) -> str:
        """Converts a Python type to a TypeScript type using the VARIABLE_TYPE_MAP.

        Args:
            text: A string that represents the Python type to be converted.

        Returns:
            A string that represents the TypeScript type, with the format '<type>[]' for list types.
        """
        # Check if the type is a list type and get the prefix
        _isList, _listPrefix = Utils.isList(text)
        # If the type is a list type
        if _isList:
            # Remove the prefix from the type
            text = text.removeprefix(_listPrefix)
            # Remove the closing bracket from the type
            text = text.removesuffix("]")
            # Recursively convert the element type and add the brackets
            return f"{Utils.convertType(text)}[]"
        else:  # If the type is not a list type
            # Look up the type in the map and get the corresponding TypeScript type
            newType = Utils.VARIABLE_TYPE_MAP.get(text)
            if newType is None:  # If the type is not in the map
                # Use the original type as the TypeScript type
                newType = text
            # Return the TypeScript type
            return newType

    @staticmethod
    def parseWithInspect(f):
        """Parses the signature of a function using the inspect module.

        Args:
            f (function): The function to be parsed.

        Returns:
            paramNames (list of str): The names of the parameters of the function.
            paramTypes (list of str): The types of the parameters of the function, or empty strings if not annotated.
            returnType (str): The type of the return value of the function, or "Response" if not annotated.
        """

        # Get the signature object of the function
        sig = signature(f)

        # Split the signature string by the arrow symbol
        sigSplit = sig.__str__().split("->")

        def parseReturnType(sigSplitList: list[str]) -> str:
            """Parses the return type from the signature split list.

            Args:
                sigSplitList (list of str):
                    The list of strings obtained by splitting the signature string by the
                    arrow symbol.

            Returns:
                str: The return type of the function, or "Response" if not annotated.
            """

            # If the list has two elements, the second one is the return type
            if len(sigSplitList) == 2:
                return Utils.simplyVariableType(sigSplit[1])
            else:
                # No annotation for the return type
                # By default it is Response
                return "Response"

        def parseParameters(inputPartStr: str):
            """Parses the parameters from the input part of the signature string.

            Args:
                inputPartStr (str): The input part of the signature string, i.e. the part before the arrow symbol.

            Returns:
                paramNames (list of str)
                    The names of the parameters of the function.
                paramTypes (list of str)
                    The types of the parameters of the function, or empty strings if not annotated.
            """

            # Remove spaces from the input part
            inputPartStr = inputPartStr.replace(" ", "")

            # Remove unnecessary quotation marks from the edges
            inputPartStr = inputPartStr.strip("'")

            # Remove leading and ending parentheses
            inputPartStr = inputPartStr.removeprefix("(").removesuffix(")")

            # Split the input part by commas
            inputParameters = inputPartStr.split(",")

            # Remove 'self' from the input parameters
            inputParameters.remove("self")

            parNames = []
            parTypes = []
            for parStr in inputParameters:
                # Get rid of default arguments
                parStr = parStr.split("=")[0]

                # Split the parameter string by the colon symbol
                parParts = parStr.split(":")
                parNames.append(parParts[0].strip(" '"))

                # If the parameter has a type annotation, append it to the list
                if len(parParts) == 2:
                    parTypes.append(Utils.simplyVariableType(parParts[1]))
                else:
                    # No type annotation for the parameter
                    parTypes.append("")

            return parNames, parTypes

        # Parse the return type from the signature split list
        returnType = parseReturnType(sigSplit)

        # Parse the parameters from the input part of the signature string
        paramNames, paramTypes = parseParameters(sigSplit[0])

        # Return the parsed names, types, and return type
        return paramNames, paramTypes, returnType


class Generator:
    """
    A class to generate TypeScript code for interfaces.
    """

    @staticmethod
    def header():
        """
        Generate the header for the TypeScript file.

        Returns:
            list: A list of strings that represent the header lines.
        """
        # Get the current time as a string without the microseconds part
        cTime = datetime.now().__str__().split(".")[0]
        # Create a list of strings for the header lines
        cLines = [
            "////////////////////////////////////////////////////",
            "// Auto generated file",
            f"// Generation time: {cTime}",
            "////////////////////////////////////////////////////",
            "",
        ]
        # Return the header lines
        return cLines

    @staticmethod
    def imports(deps):
        """
        Generate the import statements for the TypeScript file.

        Args:
            deps (list): A list of strings that represent the dependencies of the interfaces.

        Returns:
            list: A list of strings that represent the import statements.
        """
        # Create an empty list to store the import statements
        cLines = []
        # Loop through the dependencies list
        for dep in deps:
            # Append an import statement for each dependency to the list
            cLines.append(f'import {{ {dep} }} from "../models/{dep}";')

        # Append an empty line to the list
        cLines.append("")

        # Return the import statements
        return cLines

    @staticmethod
    def interface(name: str, interface):
        """
        Generate the interface declaration for the TypeScript file.

        Args:
            name (str): The name of the interface.
            interface (Interface): An Interface object that represents the interface.

        Returns:
            list: A list of strings that represent the interface declaration.
        """
        # Create an empty list to store the interface declaration
        # Append a comment for the interface name to the list
        # Append the interface declaration start to the list
        cLines = [f"// {name} interface",
                  f"export interface {name} {{"]

        # Check if the interface has any properties
        if len(interface.props) > 0:
            # Append a comment for the properties section to the list
            cLines.append("  // Properties")
            # Loop through the properties list
            for prop in interface.props:
                # Append each property declaration to the list
                cLines.append(f"  {prop}")
            # Append an empty line to the list
            cLines.append("")

        # Check if the interface has any signals
        if len(interface.signals) > 0:
            # Append a comment for the signals section to the list
            cLines.append("  // Signals")
            # Loop through the signals list
            for signal in interface.signals:
                # Append each signal declaration to the list
                cLines.append(f"  {signal}")
            # Append an empty line to the list
            cLines.append("")

        # Check if the interface has any slots
        if len(interface.slots) > 0:
            # Append a comment for the slots section to the list
            cLines.append("  // Slots")
            # Loop through the slots list
            for slot in interface.slots:
                # Append each slot declaration to the list
                cLines.append(f"  {slot}")
            # Append an empty line to the list
            cLines.append("")

        # Remove the last empty line from the list
        cLines.pop(len(cLines) - 1)
        # Append the interface declaration end to the list
        cLines.append(f"}}")
        # Append an empty line to the list
        cLines.append(f"")

        # Return the interface declaration
        return cLines


class Logger:
    """
    A class to log messages with different colors and levels.
    """

    def __init__(self) -> None:
        """
        Initialize a Logger object.
        """
        # Call the init method of the colorama module
        colorama.init(autoreset=True)

    @staticmethod
    def info(message, sender="") -> None:
        """
        Log an info message with green color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with green color for the level, cyan color for the sender, and reset color for the message
        print(
            f"\r{Fore.GREEN}[INFO] - {Back.CYAN}{sender}{Back.RESET}: {message}{Fore.RESET}"
        )

    @staticmethod
    def warning(message, sender="") -> None:
        """
        Log a warning message with yellow color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with yellow color for the level and the message, and reset color for the sender
        print(f"\r{Fore.YELLOW}[WARNING] - {sender}: {message}{Fore.RESET}")

    @staticmethod
    def error(message, sender="") -> None:
        """
        Log an error message with red color and optional sender name.

        Args:
            message (str): The message to log.
            sender (str): The name of the sender of the message. Default to "".

        Returns:
            None
        """
        # Print the message with red color for the level and the message, and reset color for the sender
        print(f"\r{Fore.RED}[ERROR] - {sender}: {message}{Fore.RESET}")

    @staticmethod
    def status(message, override=True) -> None:
        """
        Log a status message with blue color and optional override flag.

        Args:
            message (str): The message to log.
            override (bool): A flag to indicate whether to override the previous status message or not. Default to True.

        Returns:
            None
        """
        # Check if the override flag is True
        if override:
            # Write the message with blue color for the level and the message to the standard output
            sys.stdout.write(f"\r{Fore.BLUE}[STATUS]: {message}{Fore.RESET}")
            # Flush the standard output
            sys.stdout.flush()
        else:
            # Print the message with blue color for the level and the message
            print(f"\r{Fore.BLUE}[STATUS]: {message}{Fore.RESET}")
