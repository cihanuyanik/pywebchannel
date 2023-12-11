from pywebchannel.code_analyzer.utils.Utils import Utils


class Return:
    def __init__(self, type: str) -> None:
        """
        Initialize a Return object.

        Args:
            type (str): The type of the return value.
        """
        # Assign the type attribute
        self.type = type
        # Initialize the code attribute as an empty string
        self.code = ""

    def __repr__(self) -> str:
        """
        Return the code or a string representation of the return type.

        Returns:
            str: The code or a string representation of the return type.
        """
        # Check if the code attribute is not empty
        if self.code != "":
            # Return the code attribute
            return self.code

        # Return a formatted string with the type attribute
        return f"Return({self.type})"

    def convertType(self) -> None:
        """
        Convert the type attribute to a TypeScript compatible type.
        """
        # Use the convertType method from the Utils class to assign the type attribute
        self.type = Utils.convertType(self.type)

    def convertCode(self) -> None:
        """
        Generate the code attribute for the return type.
        """
        # Use the type attribute to assign the code attribute as a TypeScript return type declaration
        self.code = f"{self.type}"

    def dependencies(self):
        """
        Return the dependencies of the return type.

        Returns:
            list: A list of the types that the return type depends on.
        """
        # Return a list with the type attribute without the array notation
        return [self.type.replace("[]", "")]
