from PySide6.QtCore import QMetaMethod

from pywebchannel.code_analyzer.SupportedTypes import SupportedTypes
from pywebchannel.code_analyzer.models.Interface import Interface
from pywebchannel.code_analyzer.models.Parameter import Parameter
from pywebchannel.code_analyzer.models.Property import Property
from pywebchannel.code_analyzer.models.Return import Return
from pywebchannel.code_analyzer.models.Signal import Signal
from pywebchannel.code_analyzer.models.Slot import Slot
from pywebchannel.code_analyzer.utils.Utils import Utils


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

            # Fill the parameters of the signal
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
                # If the signal does not have an arguments map, use the method information to get the parameter names and types
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
