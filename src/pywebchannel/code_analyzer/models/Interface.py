from typing import List

from PySide6.QtCore import QMetaObject

from pywebchannel.code_analyzer.models.Property import Property
from pywebchannel.code_analyzer.models.Signal import Signal
from pywebchannel.code_analyzer.models.Slot import Slot


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
