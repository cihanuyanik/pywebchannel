from pywebchannel.code_analyzer.SupportedTypes import SupportedTypes
from pywebchannel.code_analyzer.models.ControllerInterface import ControllerInterface
from pywebchannel.code_analyzer.models.ModelInterface import ModelInterface
from pywebchannel.code_analyzer.utils.Utils import Utils


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
