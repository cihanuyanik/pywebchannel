from typing import List, Dict, Optional

from PySide6.QtCore import QObject
from pydantic import BaseModel

from pywebchannel import Controller, Signal, Action, Property, Convert, Notify, EmitBy


class Todo(BaseModel):
    id: str
    text: str
    completed: bool
    isSelected: bool

    # createdAt: datetime


class TodoController(Controller):
    """A subclass of ControllerBase that implements the logic for managing a list of todos.

    Attributes:
        ids: A list of strings that store the ids of the todos.
        entities: A dictionary that maps the ids of the todos to their Todo objects.
        selectedIds: A list of strings that store the ids of the selected todos.
        testSignal: A signal that is emitted by the testAction method with some arguments.
        todoCount: A property that stores the number of todos in the list.
        todoCountChanged: A signal that is emitted when the todoCount property changes.
    """

    def __init__(self, parent: Optional[QObject] = None):
        """Initializes the TodoController with an optional parent.

        Args:
            parent: An optional QObject that is the parent of the controller.
        """
        super().__init__("TodoController", parent)

        self.ids: List[str] = []
        self.entities: Dict[str, Todo] = {}
        self.selectedIds: List[str] = []

    # Signal definitions
    testSignal = Signal(
        {"arg1": int, "arg2": str, "arg3": List[list[float]], "arg4": List[Todo]}
    )

    testSignal2 = Signal([str, float, list[list[float]], List[Todo]])

    @Action()
    def testAction(self):
        """A test method that prints a message and emits the testSignal with some arguments.

        This method is for demonstration purposes only and does not affect the state of the todos.
        """
        print("Test Action called")
        matrix = [[2.3, 5.2, -3.2], [5.5, 6.2, 12.3], [-5.5, -4.2, -7.3]]
        todos = [
            Todo(id="1", text="todo1", completed=False, isSelected=False),
            Todo(id="2", text="todo2", completed=True, isSelected=False),
            Todo(id="3", text="todo3", completed=False, isSelected=True),
        ]

        # Since the signal is Qt type and the data is transferred through web socket, it needs to be
        # serialized properly to keep Qt Signal and QWebChannel happy.
        self.testSignal.emit(5, "testArg", matrix, Convert.from_py_to_web(todos))

    todoCount = Property(int, init_val=0)

    @Action()
    def getTodos(self):
        """Returns the current state of the todos as a dictionary.

        Returns:
            A dictionary that contains the ids, entities, selectedIds, and todoCount of the todos.
        """

        return {
            "ids": self.ids,
            "entities": self.entities,
            "selectedIds": self.selectedIds,
            "todoCount": self.todoCount,
        }

    @Action(Notify({"new_todo": Todo}))
    def add(self, new_todo: Todo):
        """Adds a new todo to the list and emits the newTodoAdded signal with the new todo as an argument.

        Args:
            new_todo: A Todo object that represents the new todo to be added.

        Returns:
            The new todo that was added.
        """
        self.ids.append(new_todo.id)
        self.entities[new_todo.id] = new_todo
        if new_todo.isSelected:
            self.selectedIds.append(new_todo.id)

        print("New todo added: Count = ", len(self.ids))

        self.todoCount = len(self.ids)

        return new_todo

    @Action(Notify({"removed_todo": Todo}))
    def remove(self, todo_id: str):
        """Removes a todo from the list by its id and emits the todoRemoved signal with the removed todo as an argument.

        Args:
            todo_id: A string that represents the id of the todo to be removed.

        Returns:
            The removed todo that was removed.
        """
        self.ids.remove(todo_id)

        if self.entities[todo_id].isSelected:
            self.selectedIds.remove(todo_id)

        removedTodo = self.entities.pop(todo_id)

        print(f"Todo ({todo_id}) removed: Count = ", len(self.ids))

        self.todoCount = len(self.ids)

        return removedTodo

    @Action(Notify({"todo": Todo}, "todoUpdated", EmitBy.User))
    def update(self, todo: Todo):
        """Updates a todo in the list by its id and emits the todoUpdated signal with the updated todo as an argument.

        Args:
            todo: A Todo object that represents the updated todo.

        Returns:
            The updated todo that was updated.
        """
        if todo.id in self.ids:
            self.entities[todo.id] = todo
            if self.entities[todo.id].isSelected and todo.id not in self.selectedIds:
                self.selectedIds.append(todo.id)

            if not self.entities[todo.id].isSelected and todo.id in self.selectedIds:
                self.selectedIds.remove(todo.id)

        print(f"Todo ({todo.id}) updated: ", self.entities[todo.id])

        # Since the signal is Qt type and the data is transferred through web socket, it needs to be
        # serialized properly to keep Qt Signal and QWebChannel happy.
        self.todoUpdated.emit(Convert.from_py_to_web(todo))

        return todo
