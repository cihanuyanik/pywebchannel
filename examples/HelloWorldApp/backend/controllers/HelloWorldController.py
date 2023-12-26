# controllers/HelloWorldController.py
from typing import Optional
from PySide6.QtCore import QObject

from pywebchannel import Controller, Action


# Create a Controller class
class HelloWorldController(Controller):
    def __init__(self, parent: Optional[QObject] = None):
        # Controller name is typically the name of the class '__name__' attribute could be used as well
        super().__init__("HelloWorldController", parent)

    # Create a class method and decorate it with @Action() decorator.
    # Don't forget to put annotations in your arguments. It is important!
    @Action()
    def sayHello(self, name: str):
        # raise Exception("Failed somehow (test exception)")

        # return as object/dictionary
        # return {"message": f"Hello from 'HelloWorldController.sayHello' to my friend {name}"}

        # return as plain string
        return f"Hello from 'HelloWorldController.sayHello' to my friend {name}"
