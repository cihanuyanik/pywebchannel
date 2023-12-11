from pywebchannel.code_analyzer.utils.Utils import Utils


class Parameter:
    """A class to represent a parameter in TypeScript.

    Attributes:
        name (str): The name of the parameter.
        type (str): The type of the parameter in TypeScript syntax.
        code (str): The code representation of the parameter.

    Methods:
        __repr__ (str): Return the string representation of the parameter.
        convertType (): Convert the type of the parameter to TypeScript syntax.
        convertCode (): Generate the code representation of the parameter.
        dependencies (list[str]): Return a list of the dependencies of the parameter type.
    """

    def __init__(self, name: str, type: str) -> None:
        """Create a new Parameter instance.

        Args:
            name (str): The name of the parameter.
            type (str): The type of the parameter in TypeScript syntax.
        """
        # Assign the name and type to the instance attributes
        self.name = name
        self.type = type
        # Initialize the code attribute as an empty string
        self.code = ""

    def __repr__(self) -> str:
        """Return the string representation of the parameter.

        Returns:
            str: The code attribute if not empty, otherwise a formatted string with the name and type.
        """
        # If the code attribute is not empty, return it
        if self.code != "":
            return self.code

        # Otherwise, return a formatted string with the name and type
        return f"Parameter({self.name}, {self.type})"

    def convertType(self) -> None:
        """Convert the type of the parameter to TypeScript syntax."""
        # Use the Utils class to convert the type
        self.type = Utils.convertType(self.type)

    def convertCode(self) -> None:
        """Generate the code representation of the parameter."""
        # Format the code attribute with the name and type
        self.code = f"{self.name}: {self.type}"

    def dependencies(self) -> list[str]:
        """Return a list of the dependencies of the parameter type.

        Returns:
            list[str]: A list of the types that the parameter type depends on, without brackets.
        """
        return [self.type.replace("[]", "")]
