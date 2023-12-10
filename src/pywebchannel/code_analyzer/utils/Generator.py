from datetime import datetime


class Generator:
    """
    A class to generate TypeScript code for interfaces.

    Methods:
        header(): Generate the header for the TypeScript file.
        imports(deps): Generate the import statements for the TypeScript file.
        interface(name, interface): Generate the interface declaration for the TypeScript file.
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
        cLines = []
        # Append a comment for the interface name to the list
        cLines.append(f"// {name} interface")
        # Append the interface declaration start to the list
        cLines.append(f"export interface {name} {{")

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
