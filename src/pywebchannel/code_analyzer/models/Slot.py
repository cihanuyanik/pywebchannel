from src.pywebchannel.code_analyzer.models.Parameter import Parameter
from src.pywebchannel.code_analyzer.models.Return import Return


class Slot:
    """
    A class to represent a slot of a TypeScript class.

    Attributes:
        name (str): The name of the slot.
        parameters (list[Parameter]): A list of Parameter objects that represent the parameters of the slot function.
        returnType (Return): A Return object that represents the return type of the slot function.
        code (str): The code for the slot declaration in TypeScript.
    """

    def __init__(
            self, name: str, parameters: list[Parameter], returnType: Return
    ) -> None:
        """
        Initialize a Slot object.

        Args:
            name (str): The name of the slot.
            parameters (list[Parameter]): A list of Parameter objects that represent the parameters of the slot function.
            returnType (Return): A Return object that represents the return type of the slot function.
        """
        # Assign the name, parameters and returnType attributes
        self.name = name
        self.parameters = parameters
        self.returnType = returnType
        # Initialize the code attribute as an empty string
        self.code = ""

    def __repr__(self) -> str:
        """
        Return the code or a string representation of the slot.

        Returns:
            str: The code or a string representation of the slot.
        """
        # Check if the code attribute is not empty
        if self.code != "":
            # Return the code attribute
            return self.code

        # Return a formatted string with the name, parameters and returnType attributes
        return f"Slot( {self.name}, {self.parameters}, {self.returnType} )"

    def convertType(self) -> None:
        """
        Convert the type attributes of the parameters and the returnType to TypeScript compatible types.
        """
        # Loop through the parameters list
        for param in self.parameters:
            # Call the convertType method of the Parameter object
            param.convertType()

        # Call the convertType method of the Return object
        self.returnType.convertType()

    def convertCode(self) -> None:
        """
        Generate the code attribute for the slot.
        """

        # Define a helper function to convert a Parameter object to a TypeScript parameter declaration
        def paramConvert(param: Parameter) -> str:
            # Call the convertCode method of the Parameter object
            param.convertCode()
            # Return the code attribute of the Parameter object
            return param.code

        # Use the map function to apply the paramConvert function to each element of the parameters list
        # Use the join method to combine the resulting list into a string separated by commas
        paramCodesCombined = ", ".join([*map(paramConvert, self.parameters)])

        # Call the convertCode method of the Return object
        self.returnType.convertCode()

        # Use the name, paramCodesCombined and returnType attributes to assign the code attribute as a TypeScript slot declaration
        self.code = (
            f"{self.name}({paramCodesCombined}): Promise<{self.returnType.code}>;"
        )

    def dependencies(self):
        """
        Return the dependencies of the slot.

        Returns:
            list: A list of the types that the slot depends on.
        """
        # Initialize an empty list to store the dependencies
        dep = []
        # Loop through the parameters list
        for param in self.parameters:
            # Extend the dep list with the dependencies of the Parameter object
            dep.extend(param.dependencies())

        # Extend the dep list with the dependencies of the Return object
        dep.extend(self.returnType.dependencies())
        # Return the dep list
        return dep
