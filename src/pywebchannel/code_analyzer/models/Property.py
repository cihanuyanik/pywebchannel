from src.pywebchannel.code_analyzer.utils.Utils import Utils


class Property:
    def __init__(self, name: str, type: str) -> None:
        """
        Initialize a Property object.

        Args:
            name (str): The name of the property.
            type (str): The type of the property.
        """
        # Assign the name and type attributes
        self.name = name
        self.type = type
        # Initialize the code attribute as an empty string
        self.code = ""

    def __repr__(self) -> str:
        """
        Return the code or a string representation of the property.

        Returns:
            str: The code or a string representation of the property.
        """
        # Check if the code attribute is not empty
        if self.code != "":
            # Return the code attribute
            return self.code

        # Return a formatted string with the name and type attributes
        return f"Property({self.name}, {self.type})"

    def convertType(self) -> None:
        """
        Convert the type attribute to a TypeScript compatible type.
        """
        # Use the convertType method from the Utils class to assign the type attribute
        self.type = Utils.convertType(self.type)

    def convertCode(self) -> None:
        """
        Generate the code attribute for the property.
        """
        # Use the name and type attributes to assign the code attribute as a TypeScript property declaration
        self.code = f"{self.name}: {self.type};"

    def dependencies(self):
        """
        Return the dependencies of the property.

        Returns:
            list: A list of the types that the property depends on.
        """
        # Return a list with the type attribute
        return [self.type.replace("[]", "")]
