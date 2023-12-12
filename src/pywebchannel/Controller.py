import functools
import inspect
from typing import Optional, Dict, Any, List, Tuple

from PySide6 import QtCore
from PySide6.QtCore import QObject, Slot
from pydantic import BaseModel

from pywebchannel.Utils import Logger


class Controller(QObject):
    """A base class for controllers that provides common functionality.

    Attributes:
        _controllerName: A private instance attribute that stores the name of the controller.
    """

    def __init__(self, controllerName: str, parent: Optional[QObject] = None) -> None:
        """Initializes the controller with a name and an optional parent.

        Args:
            controllerName: A string that represents the name of the controller.
            parent: An optional QObject that is the parent of the controller.
        """
        super().__init__(parent)
        self._controllerName = controllerName

    __signalArgsMap__: Dict[str, Dict[str, type]] = dict()
    __propsTypes__: Dict[str, type | Tuple[type, QtCore.Signal]] = dict()
    __actionNotifications__: Dict[str, Dict[str, type]] = dict()

    def __init_subclass__(cls, **kwargs):
        """A special method that is called when a subclass of Controller is created.

        This method performs some operations on the class attributes to prepare them for the subclass.

        Args:
            **kwargs: Arbitrary keyword arguments that are passed to the method.
        """

        def move_from_base_to_cls(base_attr_name: str, cls_attr_name: str):
            """A helper function that moves the items from a base class attribute to a subclass attribute.

            This function is used to separate the signal arguments and prop types that belong to the subclass from the
            ones that belong to the base class.

            Args:
                base_attr_name: A string that represents the name of the base class attribute.
                cls_attr_name: A string that represents the name of the subclass attribute.
            """
            result = dict()
            for key, value in [*getattr(cls, base_attr_name).items()]:
                if key.__contains__(cls.__name__):
                    result[key.removeprefix(f"{cls.__name__}.")] = value
                    del getattr(cls, base_attr_name)[key]

            setattr(cls, cls_attr_name, result)

        # Generate notifier signals
        for name, signalArgs in [*cls.__actionNotifications__.items()]:
            if name.__contains__(cls.__name__):
                signalName = name.split(".")[1]
                signal = Signal(signalArgs, cls.__name__, signalName)
                setattr(cls, signalName, signal)
                del cls.__actionNotifications__[name]

        # Move signal arguments from base class into the concrete class
        move_from_base_to_cls("__signalArgsMap__", "signalArgsMap")

        # Move prop types from base class into the concrete class
        move_from_base_to_cls("__propsTypes__", "propsTypes")

        # Create 'Changed' signals of properties
        # noinspection PyUnresolvedReferences
        for propName, (propType, propChangedSignal) in cls.propsTypes.items():
            setattr(cls, f"{propName}Changed", propChangedSignal)
            # noinspection PyUnresolvedReferences
            cls.propsTypes[propName] = propType

    def name(self) -> str:
        """Returns the name of the controller.

        Returns:
            A string that represents the name of the controller.
        """
        return self._controllerName

    def cleanup(self) -> None:
        """Performs any necessary cleanup actions before the controller is destroyed.

        This method can be overridden by subclasses to implement their own cleanup logic.
        """
        pass


class Response(BaseModel):
    """A Pydantic model that represents the outcome of some operation.
    """
    
    success: Optional[str] = None
    """A string that indicates whether the operation was successful or not. It can be None or any string value. For 
    example, "yes", "no", "ok", "error", etc."""

    error: Optional[str] = None
    """A string that provides an error message if something went wrong during the operation. It can be None or any 
    string value. For example, "Invalid input", "Connection timeout", "Database error"etc."""

    data: Optional[Any] = None
    """Any Python object that stores the result of the operation. It can be of any type, such as a dict, a list, 
    a tuple, a string, a number, etc. Pydantic will not perform any validation or conversion on this field."""


class Helper:
    @staticmethod
    def infer_caller_info(stack: List[inspect.FrameInfo]) -> Tuple[str, str]:
        """
        A method that infers the name of the controller and the variable that called this method from the stack trace.

        Parameters
        ----------
        stack : List[inspect.FrameInfo]
            A list of frame information objects representing the current call stack.

        Returns
        -------
        Tuple[str, str]
            A tuple of two strings: the name of the controller and the name of the variable that called this method.
            If the variable name cannot be inferred, an empty string is returned as the second element of the tuple.
        """
        # The name of the controller is the name of the function in the previous frame
        controllerName: str = stack[1][3]
        # The line of code that defines the variable in the previous frame
        definition_split = stack[1][4][0].strip(" \n").replace(" ", "").split("=")

        # If the line of code has an assignment operator
        if len(definition_split) >= 2:
            # The name of the variable is the left-hand side of the assignment
            varName = definition_split[0]
        else:
            # Otherwise, the variable name cannot be inferred
            varName = ""

        # Return the tuple of controller name and variable name
        return controllerName, varName


class Type:
    """
    This class provides some utility methods to check the type of variable.

    Methods:
        is_primitive(var_type: type) -> bool:
            Returns True if the given type is a primitive type, False otherwise.

        is_list(var_type: type) -> bool:
            Returns True if the given type is a list type, False otherwise.

        is_pydantic(var_type: type) -> bool:
            Returns True if the given type is a subclass of pydantic.BaseModel, False otherwise.
    """

    primitives = (bool, str, int, float, type(None))
    """
    A tuple of primitive types in Python, such as bool, str, int, float, and NoneType.
    """

    @staticmethod
    def is_primitive(var_type: type):
        return var_type in Type.primitives

    @staticmethod
    def is_list(var_type: type):
        return var_type.__name__.lower() == "list"

    @staticmethod
    def is_pydantic(var_type: type):
        return issubclass(var_type, BaseModel)


class Convert:
    """
    This class provides some utility methods to convert data types between Python, Qt, and web formats.
    """

    @staticmethod
    def from_py_to_qt(argDict: Dict[str, type]) -> Tuple[List[str], List[type]]:
        """Converts a dictionary of argument names and types from Python to Qt format.
            - Primitive types are kept as they are.
            - List types are converted to list type.
            - Pydantic types are converted to dict type.
            - Other types are converted to dict type.

        Returns:
            Tuple[List[str], List[type]] - argument names and argument types.
        """
        arg_names = []
        arg_types = []
        for arg_name, arg_type in argDict.items():
            if arg_name == "return":
                continue
            arg_names.append(arg_name)

            if Type.is_primitive(arg_type):
                arg_types.append(arg_type)
            elif Type.is_list(arg_type):
                arg_types.append(list)
            elif Type.is_pydantic(arg_type):
                arg_types.append(dict)
            else:
                arg_types.append(dict)

        return arg_names, arg_types

    @staticmethod
    def from_web_to_py(arg, paramType) -> Any:
        """Converts a web format argument to a Python format argument according to the given parameter type.

        Returns:
            - Primitive types are kept as they are.
            - List types are recursively converted using the inner type.
            - Pydantic types are instantiated using the argument as a keyword dictionary.
            - Other types are kept as they are.
        """
        if Type.is_primitive(paramType):
            return arg
        elif Type.is_list(paramType):
            innerType = paramType.__args__[0]
            for i in range(len(arg)):
                arg[i] = Convert.from_web_to_py(arg[i], innerType)
            return arg
        elif Type.is_pydantic(paramType):
            return paramType(**arg)
        else:
            return arg

    @staticmethod
    def from_py_to_web(arg) -> Any:
        """Converts a Python format argument to a web format argument.

        Returns:
            - Primitive types are kept as they are.
            - List types are recursively converted using the inner type.
            - Pydantic types are converted to a dictionary using the dict() method.
            - Other types are converted to a dictionary using the dict() method.
        """
        if Type.is_primitive(type(arg)):
            return arg

        if Type.is_list(type(arg)):
            for i in range(len(arg)):
                arg[i] = Convert.from_py_to_web(arg[i])
            return arg

        if Type.is_pydantic(type(arg)):
            return arg.model_dump()

        return arg

    @staticmethod
    def from_py_to_web_response(result) -> Dict[str, Any]:
        """Converts a Python format result to a web format response.
            - String types are wrapped in a Response object with success attribute.
            - Response types are converted to a dictionary using the dict() method.
            - Other types are wrapped in a Response object with data attribute.

        Returns:
             Dict[str, Any] - a dictionary that represents the response.
        """
        if isinstance(result, str):
            return Response(success=result).model_dump()

        if isinstance(result, Response):
            return result.model_dump()

        return Response(data=result).model_dump()


class EmitBy:
    """A class to represent the source of a notification."""

    Auto = 0
    User = 1


class Notify:
    """A class to represent a notification object.

    Attributes:
        name (str): The name of the notification.
        arguments (Dict[str, type]): A dictionary of the arguments that the notification expects, with the argument
        name as the key and the argument type as the value.
        emitBy (EmitBy): The source of the notification, either EmitBy.Auto or EmitBy.User.
        The default value is EmitBy.Auto.
    """

    def __init__(
            self,
            arguments: Dict[str, type] | List[type],
            name: str = None,
            emitBy: EmitBy = EmitBy.Auto,
    ):
        """
        The constructor method for the Notify class.

        Args:
            name (str): The name of the notification.
            arguments (Dict[str, type] or List[type]): A dictionary of the arguments that the notification expects,
            with the argument name as the key and the argument type as the value.
            emitBy (EmitBy, optional): The source of the notification, either EmitBy.Auto or EmitBy.User.
            The default value is EmitBy.Auto.
        """

        self.name = name
        self.arguments = arguments
        self.emitBy = emitBy


def Action(notify: Notify = None):
    """
    A decorator that converts a Python function into a Qt slot. The notify argument is used to emit after the function
    is executed. Defaults to None. If it is specified, a signal with the given name will be created and attached
    into the class. You don't need to create that signal yourself

    Args:
        notify (Notify, optional): A Notify object that specifies the name and arguments of a notification signal

    Returns:
        A wrapper function that is a Qt slot with the same arguments and return type as the original function.
        The slot also handles serialization and deserialization of inputs and outputs, and optionally
        emits a notification signal with the result.
    """

    # The decorator function takes the function to be wrapped as an argument
    def ActionWrapper(func):
        # Get the annotations of the function, which are the types of the arguments and return value
        annots: dict = func.__annotations__
        # Convert the Python types to Qt types
        arg_names, arg_types = Convert.from_py_to_qt(annots)

        # Define the slot with the Qt types and the result type as a dict
        @Slot(*arg_types, result=dict)
        # Preserve the name and docstring of the original function
        @functools.wraps(func)
        def wrapper(*args):
            try:
                # Deserialize inputs
                params = [*args]
                for i, paramName in enumerate(annots):
                    paramType = annots[paramName]
                    # Convert the input from web format to Python format
                    params[i + 1] = Convert.from_web_to_py(params[i + 1], paramType)

                # Call the original function
                result = func(*params)

                # If a notification signal is specified
                if notify is not None and notify.emitBy == EmitBy.Auto:
                    # Convert the result from Python format to web format
                    result = Convert.from_py_to_web(result)
                    # Get the signal object from the first argument, which is the controller
                    signal = getattr(params[0], notify.name, None)
                    # If the signal object exists, emit it with the result
                    if signal is not None:
                        signal.emit(result)

                # Serialize response
                # Convert the result from Python format to web response format
                return Convert.from_py_to_web_response(result)

            # Handle any exceptions
            except Exception as e:
                Logger.error(str(e))
                # Return a response with the error message
                return Response(error=str(e)).model_dump()

        # If a notification signal is specified
        if notify is not None:
            # Get the name of the controller that defines the function
            controllerName, _ = Helper.infer_caller_info(inspect.stack())

            if notify.name is None:
                funcName = func.__name__
                # Convert first letter to upper case
                notify.name = "on" + str(funcName[0]).upper() + funcName[1:]

            # Store the notification information in a class attribute of Controller
            Controller.__actionNotifications__[
                f"{controllerName}.{notify.name}"
            ] = notify.arguments

        return wrapper

    return ActionWrapper


def Signal(
        args: Dict[str, type] | List[type],
        controllerName: str = None,
        signalName: str = None,
):
    """A function that creates a Qt signal with the given arguments.

    Args:
        args (Dict[str, type] or List[type]): A dictionary that maps the names and types of the signal arguments.
        controllerName (str, optional): The name of the controller that defines the signal. Defaults to None.
        signalName (str, optional): The name of the signal. Defaults to None.

    Returns:
        A Qt signal object with the specified arguments, name, and arguments names.

    Raises:
        Exception: If the controller name or signal name cannot be inferred from the caller information, or if the
        signal name is empty.
    """

    # Convert type list into map
    argsMap: Dict[str, type] = dict()
    if isinstance(args, list):
        for i in range(len(args)):
            argsMap[f"arg{i + 1}"] = args[i]

        args = argsMap

    # Rearrange variable types so that Qt Signal will be happy
    arg_names, arg_types = Convert.from_py_to_qt(args)

    # Register signal arguments for proper type-script generation
    # If the controller name or signal name are not given, infer them from the caller information
    if controllerName is None or signalName is None:
        controllerName, signalName = Helper.infer_caller_info(inspect.stack())
        # If the signal name is empty, raise an exception
        if signalName == "":
            raise Exception(
                f"Signal definition at {controllerName} is missing output bound variable"
            )

    # Store the signal arguments in a class attribute of Controller
    Controller.__signalArgsMap__[f"{controllerName}.{signalName}"] = args

    # Create a new signal with the Qt types, name, and arguments names
    signal = QtCore.Signal(*arg_types, name=signalName, arguments=arg_names)

    # Return the signal object
    return signal


# Define a function that creates a Qt property and a corresponding signal
def Property(p_type: type, init_val=None, get_f=None, set_f=None):
    """A function that creates a Qt property and a corresponding signal.

    Args:
        p_type (type): The type of the property value.
        init_val: The initial value of the property. Defaults to None
        get_f (function, optional): A custom getter function for the property. Defaults to None.
        set_f (function, optional): A custom setter function for the property. Defaults to None.

    Returns:
        The prop which is a Qt property object

    Raises:
        Exception: If the property name cannot be inferred from the caller information
    """

    # Get call stack and infer:
    controllerName, propName = Helper.infer_caller_info(inspect.stack())
    # If the variable names are empty, raise an exception
    if propName == "":
        raise Exception(
            f"Property definition at {controllerName} is missing output bound variable 'property'"
        )

    signalName = f"{propName}Changed"

    # Define default get & set behavior
    # Define a getter function that returns the property value
    def getter(self):
        # If the property value is not set, set it to the initial value
        if not hasattr(self, f"_{propName}"):
            setattr(self, f"_{propName}", init_val)

        # Return the property value
        return getattr(self, f"_{propName}")

    # Define a setter function that sets the property value
    def setter(self, new_value):
        # If the new value is different from the current value
        if getattr(self, f"_{propName}") != new_value:
            # Set the property value to the new value
            setattr(self, f"_{propName}", new_value)

            # Get the signal object from the self attribute
            s = getattr(self, f"{signalName}", None)
            # If the signal object exists, emit it with the new value
            if s is not None:
                s.emit(new_value)

    # Rearrange variable types so that Qt Property will be happy
    # Convert the Python type to a Qt type
    _, prop_type_adjusted = Convert.from_py_to_qt({propName: p_type})

    # Call the Signal function with the property name and type, and the controller name and signal name
    signal = Signal({propName: p_type}, controllerName, signalName)

    # Create property
    # Create a Qt property object with the Qt type, the getter and setter functions, and the signal
    # noinspection PyTypeChecker
    prop = QtCore.Property(
        prop_type_adjusted[0],
        # Use the custom getter function if given, otherwise use the default one
        fget=get_f if get_f is not None else getter,
        # Use the custom setter function if given, otherwise use the default one
        fset=set_f if set_f is not None else setter,
        notify=signal,
    )

    # Store the property type and relevant changed signal in a class attribute of Controller
    Controller.__propsTypes__[f"{controllerName}.{propName}"] = (p_type, signal)

    # Return the property and signal objects
    return prop
