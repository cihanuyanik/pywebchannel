from enum import StrEnum
from typing import List

from PySide6.QtCore import QMetaObject, QMetaMethod

from pywebchannel.Utils import Utils


class SupportedTypes(StrEnum):
    Controller = "Controller"
    Model = "BaseModel"


class CodeAnalyzer:
    """A class that analyzes the code of a given class and determines its type and acceptability.

    Attributes:
        MetaClass (type): The class object to be analyzed.
        _classType (str): The type of the class object, one of the supported types.
        _isAcceptable (bool): A flag indicating whether the class object is acceptable for analysis or not.
    """

    def __init__(self, MetaClass):
        """Initializes the CodeAnalyzer with the class object.

        Args:
            MetaClass (type): The class object to be analyzed.
        """

        self.MetaClass = MetaClass

        # One of the supported types
        self._classType: str = ""
        self._isAcceptable = False

        # Get the inheritance tree of the class object
        baseClasses = Utils.getInheritanceTree(MetaClass)
        # Check if the class object inherits from one of the supported types
        for sType in SupportedTypes:
            if sType in baseClasses:
                self._isAcceptable = True
                self._classType = sType

    def isAcceptable(self):
        """Returns whether the class object is acceptable for analysis or not.

        Returns:
            bool: True if the class object is acceptable, False otherwise.
        """

        return self._isAcceptable

    def classType(self):
        """Returns the type of the class object, one of the supported types.

        Returns:
            str: The type of the class object, or an empty string if not acceptable.
        """

        return self._classType

    def run(self):
        """Runs the analysis on the class object and returns an interface object.

        Returns:
            The interface object corresponding to the class object's type, or None if not acceptable.
        """

        # If the class object is a controller, return a controller interface object
        if self._classType == SupportedTypes.Controller:
            return ControllerInterface(self.MetaClass)

        # If the class object is a model, return a model interface object
        elif self._classType == SupportedTypes.Model:
            return ModelInterface(self.MetaClass)
        else:
            # The class object is not acceptable, return None
            return None


class Interface:
    """A base class that represents the interface of a class.

    An interface is a set of properties, signals, and slots that define the communication
    and functionality of a class.

    Attributes:
        MetaClass (type): The metaclass of the class that implements the interface.
        name (str): The name of the interface.
        objectDict (dict): The dictionary of the meta class's attributes and methods.
        staticMetaObject (QMetaObject): The static meta-object of the meta class.
        props (list of Property): The properties of the interface.
        signals (list of Signal): The signals of the interface.
        slots (list of Slot): The slots of the interface.
    """

    def __init__(self, MetaClass):
        """Initializes the Interface with the meta class of the class that implements the interface.

        Args:
            MetaClass (type): The meta class of the class that implements the interface.
        """

        self.MetaClass = MetaClass

        # Get the name, dictionary, and static meta object of the meta class
        self.name = self.MetaClass.__name__
        self.objectDict = MetaClass.__dict__
        self.staticMetaObject: QMetaObject = self.objectDict.get("staticMetaObject")

        # Initialize the properties, signals, and slots as empty lists
        self.props: List[Property] = []
        self.signals: List[Signal] = []
        self.slots: List[Slot] = []

    def classType(self):
        """Returns the type of the interface, which is "Interface".

        Returns:
            str: The type of the interface.
        """

        return "Interface"

    def dependencies(self):
        """Returns the list of dependencies of the interface.

        Dependencies are the types that are used by the properties, signals, and slots of the interface.

        Returns:
            The list of dependencies, without duplicates.
        """

        return []


class ControllerInterface(Interface):
    """A class that represents the interface of a controller class.

    A controller class is a subclass of QObject that defines properties, signals, and slots
    that can be used to communicate with other classes or components.

    Attributes:
        props (list of Property): The properties of the controller class.
        signals (list of Signal): The signals of the controller class.
        slots (list of Slot): The slots of the controller class.
    """

    def __init__(self, MetaClass):
        """Initializes the ControllerInterface with the meta class of the controller class.

        Args:
            MetaClass (type): The meta class of the controller class.
        """

        super().__init__(MetaClass)

        # Extract the properties, signals, and slots from the meta class
        self.props = self._extractProperties()
        self.signals = self._extractSignals()
        self.slots = self._extractSlots()

        # Convert the types and codes of the properties, signals, and slots
        for prop in self.props:
            prop.convertType()
            prop.convertCode()

        for signal in self.signals:
            signal.convertType()
            signal.convertCode()

        for slot in self.slots:
            slot.convertType()
            slot.convertCode()

    def classType(self):
        """Returns the type of the interface, which is SupportedTypes.Controller.

        Returns:
            str: The type of the interface.
        """

        return SupportedTypes.Controller

    def dependencies(self):
        """Returns the list of dependencies of the interface.

        Dependencies are the types that are used by the properties, signals, and slots of the interface.

        Returns:
            list[str]: The list of dependencies, without duplicates.
        """

        dep = []
        # Add the dependencies of the properties
        for prop in self.props:
            dep.extend(prop.dependencies())
        # Add the dependencies of the signals
        for signal in self.signals:
            dep.extend(signal.dependencies())
        # Add the dependencies of the slots
        for slot in self.slots:
            dep.extend(slot.dependencies())

        # Remove any duplicates from the list
        return list(dict.fromkeys(dep))

    def _extractProperties(self):
        """Extracts the properties from the meta class of the controller class.

        Returns:
            list[Property]: The list of properties of the controller class.
        """

        props: list[Property] = []

        # Iterate over the properties of the meta class
        for i in range(1, self.staticMetaObject.propertyCount()):
            prop = self.staticMetaObject.property(i)

            # Get the name and type name of the property
            name = prop.name()
            typeName = prop.typeName()

            # Get the type map of the properties, if any
            propTypesMap: dict = getattr(self.MetaClass, "propsTypes", None)
            propType = None
            if propTypesMap is not None:
                propType = propTypesMap[name]

            # If the property has a type map, use it to get the simplified type name
            if propType is not None:
                typeName = Utils.simplyVariableType(Utils.type_to_string(propType))

            # Create a Property object and append it to the list
            props.append(Property(name, typeName))

        return props

    def _extractSignals(self):
        """Extracts the signals from the meta class of the controller class.

        Returns:
            list[Signal]: The list of signals of the controller class.
        """

        signalInfos: list[Signal] = []
        # Iterate over the methods of the meta class
        for i in range(self.staticMetaObject.methodCount()):
            method: QMetaMethod = self.staticMetaObject.method(i)

            # Skip the methods that are not signals or are not defined by the controller class
            if method.methodType().name != "Signal":
                continue

            if method.enclosingMetaObject().className() != self.MetaClass.__name__:
                continue

            # Get the name and return type of the signal
            name = method.name().toStdString()
            returnType = Return(method.returnMetaType().name())

            # Fill with the parameters of the signal
            parameters = []
            # Get the signal arguments map, if any
            signalArgsMap: dict = getattr(self.MetaClass, "signalArgsMap", None)
            if signalArgsMap is not None:
                signalArgsMap = signalArgsMap[name]

            # If the signal has an arguments map, use it to get the parameter names and types
            if signalArgsMap is not None:
                for argName, argType in signalArgsMap.items():
                    paramTypeStr = Utils.simplyVariableType(
                        Utils.type_to_string(argType)
                    )
                    parameters.append(Parameter(argName, paramTypeStr))
            else:
                # If the signal does not have an arguments map, use the method information to get the parameter names
                # and types
                if method.parameterCount() > 0:
                    for pi in range(method.parameterCount()):
                        parameters.append(
                            Parameter(
                                method.parameterNames()[pi].toStdString(),
                                method.parameterTypeName(pi).toStdString(),
                            )
                        )

            # Create a Signal object and append it to the list
            signalInfos.append(Signal(name, parameters, returnType))

        return signalInfos

    def _extractSlots(self):
        """Extracts the slots from the meta class of the controller class.

        Returns:
            list[Slot]: The list of slots of the controller class.
        """

        slotInfos: list[Slot] = []

        # Iterate over the methods of the meta class
        for i in range(self.staticMetaObject.methodCount()):
            method: QMetaMethod = self.staticMetaObject.method(i)

            # Skip the methods that are not slots or are not defined by the controller class
            if method.methodType().name != "Slot":
                continue

            if method.enclosingMetaObject().className() != self.MetaClass.__name__:
                continue

            # Extract the name of the slot
            name = method.name().toStdString()
            # Skip the private slots
            if name.startswith("_"):
                continue

            # Get the function object of the slot
            methodFunc = self.objectDict.get(name)

            # Extract the return type and parameters of the slot
            # - 1. Check via user annotation (this has privilege)
            # - 2. Check via QMetaObject system

            # Parse the slot function with inspect
            paramNames, paramTypes, returnType = Utils.parseWithInspect(methodFunc)

            # If the return type is not found by type annotation, use the QMetaObject system
            if returnType == "":
                returnType = Return(method.returnMetaType().name())
            else:
                returnType = Return(returnType)

            parameters = []

            # If the slot has parameters, extract their names and types
            if method.parameterCount() > 0:
                for pi in range(method.parameterCount()):
                    # If the parameter type is not found by type annotation, use the QMetaObject system
                    par = Parameter(
                        paramNames[pi],
                        paramTypes[pi]
                        if paramTypes[pi] != ""
                        else method.parameterTypeName(pi).toStdString(),
                    )

                    parameters.append(par)

            # Create a Slot object and append it to the list
            slotInfos.append(Slot(name, parameters, returnType))

        return slotInfos


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


class Parameter:
    """A class to represent a parameter in TypeScript.

    Attributes:
        name (str): The name of the parameter.
        type (str): The type of the parameter in TypeScript syntax.
        code (str): The code representation of the parameter.
    """

    def __init__(self, name: str, typeStr: str) -> None:
        """Create a new Parameter instance.

        Args:
            name (str): The name of the parameter.
            typeStr (str): The type of the parameter in TypeScript syntax.
        """
        # Assign the name and type to the instance attributes
        self.name = name
        self.type = typeStr
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
        """Convert the type attribute to a TypeScript compatible type."""
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


class Return:
    def __init__(self, typeStr: str) -> None:
        """
        Initialize a Return object.

        Args:
            typeStr (str): The type of the return value.
        """
        # Assign the type attribute
        self.type = typeStr
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
            parameters (list[Parameter]): List of Parameter objects that represent the parameters of the slot function.
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

        # Use the name, paramCodesCombined and returnType attributes to assign the code attribute as a TypeScript
        # slot declaration
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


class Property:
    def __init__(self, name: str, typeStr: str) -> None:
        """
        Initialize a Property object.

        Args:
            name (str): The name of the property.
            typeStr (str): The type of the property.
        """
        # Assign the name and type attributes
        self.name = name
        self.type = typeStr
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


class Signal:
    def __init__(
            self, name: str, parameters: list[Parameter], returnType: Return
    ) -> None:
        """
        Initialize a Signal object.

        Args:
            name (str): The name of the signal.
            parameters (list[Parameter]): List of Parameter objects that represent parameters of the signal function.
            returnType (Return): A Return object that represents the return type of the signal function.
        """
        # Assign the name, parameters and returnType attributes
        self.name = name
        self.parameters = parameters
        self.returnType = returnType
        # Initialize the code attribute as an empty string
        self.code = ""

    def __repr__(self) -> str:
        """
        Return the code or a string representation of the signal.

        Returns:
            str: The code or a string representation of the signal.
        """
        # Check if the code attribute is not empty
        if self.code != "":
            # Return the code attribute
            return self.code

        # Return a formatted string with the name, parameters and returnType attributes
        return f"Signal( {self.name}, {self.parameters}, {self.returnType} )"

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
        Generate the code attribute for the signal.
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

        # Use the name, paramCodesCombined and returnType attributes to assign the code attribute as a TypeScript
        # signal declaration
        self.code = (
            f"{self.name}: Signal<({paramCodesCombined}) => {self.returnType.code}>;"
        )

    def dependencies(self):
        """
        Return the dependencies of the signal.

        Returns:
            list: A list of the types that the signal depends on.
        """
        # Initialize an empty list to store the dependencies
        dep = []
        # Loop through the parameters list
        for param in self.parameters:
            # Extend the dep list with the dependencies of the Parameter object
            dep.extend(param.dependencies())

        # Extend the dep list with the dependencies of the Return object
        dep.extend(self.returnType.dependencies())
        # Append the string "Signal" to the dep list
        dep.append("Signal")

        # Return the dep list
        return dep
