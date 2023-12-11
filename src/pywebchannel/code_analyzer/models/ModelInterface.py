from pywebchannel.code_analyzer.models.Interface import Interface
from pywebchannel.code_analyzer.models.Property import Property
from pywebchannel.code_analyzer.utils.Utils import Utils


class ModelInterface(Interface):
    """A class that represents the interface of a model class.


    Attributes:
        props (list of Property): The properties of the model class.
    """

    def __init__(self, MetaClass):
        """Initializes the ModelInterface with the meta class of the model class.

        Args:
            MetaClass (type): The meta class of the model class.
        """

        super().__init__(MetaClass)
        # Get the fields of the model class
        fields = self.objectDict["__annotations__"]

        # Create a property for each field
        for fieldName, field in fields.items():
            self.props.append(
                Property(fieldName, Utils.simplyVariableType(field.__name__))
            )

        # Convert the types and codes of the properties
        for prop in self.props:
            prop.convertType()
            prop.convertCode()

    def classType(self):
        """Returns the type of the interface, which is SupportedTypes.Model.

        Returns:
            str: The type of the interface.
        """

        return SupportedTypes.Model

    def dependencies(self):
        """Returns the list of dependencies of the interface.

        Dependencies are the types that are used by the properties of the interface.

        Returns:
            list[str]: The list of dependencies, without duplicates.
        """

        dep = []
        # Add the dependencies of the properties
        for prop in self.props:
            dep.extend(prop.dependencies())

        # Remove any duplicates from the list
        return list(dict.fromkeys(dep))
