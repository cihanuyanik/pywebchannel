# Why do you need this? 🤔

You want to create a professional UI with modern web technologies and python. But you face many challenges with the
existing libraries. Some of them rely on `window` manipulation, which is not compatible with most web frameworks. Some
of them use RestAPI libraries, which add a lot of overhead, complexity and state management issues. Some of them use
`WebSocket`s only for function calls, without any real-time synchronization features.

Among these, `QWebChannel` seems to be the best option, with a lightweight `WebSocket` protocol and features like
synchronization, function calls and property access. However, it also has its own limitations, mainly related to the Qt
type system. You cannot use it with non-supported Qt types, without doing complex conversions, manual type adjustments
and boiler-plate code, just to satisfy Qt. This makes development difficult and error-prone. And even if you manage to
do that on the python side, you still have to deal with a frontend development cycle, with no type-hinting, no
auto-completion, no compile time validation etc., which is a nightmare in javascript environment.

But don’t worry, `pywebchannel` library is here to solve your problem 😊.

## Let's investigate the problems together

Suppose you want to build a `todo application` with python and web technologies. You will require some functionality to
store the data (list of todos), modify it (add, remove, update), and inform the frontend about the changes.

## Signals 🚦

You want to create a notification mechanism to the frontend, when you add a new todo item. You can use `QtCore.Signals`
for that.

```python
# Inside your controller class
new_todo_added = QtCore.Signal()
```

This signal can be emitted in your python code, after adding the item to your list. And your frontend will receive it,
if it is connected to `new_todo_added` signal. But this signal does not carry any information about the new item. How
can you send some data with it?

```python
# Inside your controller class
new_todo_added = QtCore.Signal(str)
```

This signal can be emitted with a string parameter, and your frontend will receive it. For instance, if your todos have
an `id` field of type `str`, you can emit it. `str` is a supported type in Qt, so it works. But what if you want to send
a `Todo` object, which is a custom object of yours that inherits from `pydantic.BaseModel`?

```python
# Inside your controller class
new_todo_added = QtCore.Signal(Todo)
```

This will cause an exception like this:

```text
TypeError: Signal must be bound to a QObject, not 'Todo'
```

This is because, `Todo` is not a supported type in Qt. You can use `QtCore.QObject` as a base class for your `Todo`, to
avoid this error. But then, you will face another problem, which is not even caught by exception mechanism. You will get
an `empty object` in your frontend, instead of a `Todo` object. This is because Qt does not know how to serialize your
`Todo` object to a valid json object. The simplest way to make it work is to use `dict` instead of `Todo` object.

```python
new_todo_added = QtCore.Signal(dict)
```

But then, you will lose all the type information, and need to do type conversions. I don't even need to mention
about `list`s. You need to take care of all these details, and keep your frontend and backend in sync. This is too much
hassle…

You can use pywebchannel library, and define your signal like this:

with a list of types:

```python
from pywebchannel import Signal

# Inside your controller class
new_todo_added = Signal([Todo])
```

or even better, with argument dictionary in the form of `{arg1_name: arg1_type, ...}`:

```python
from pywebchannel import Signal

# Inside your controller class
new_todo_added = Signal({'new_todo': Todo})
```

This will ensure that Qt is happy, and your frontend and backend are in sync.

And this is just the tip of the iceberg 😎.

## Properties 🧲

A property is a way to access and modify an internal (usually private) variable, with a getter and setter, in your
class. It is a common feature in object-oriented programming. The benefits of using properties in Qt or PySide are that,
you can create a signal for a property, so that any listeners or connected objects will be updated when the property
changes.

For example, you have a property that keeps track of the number of todos. I know it is silly, but it is just for
illustration.

```python
# Inside your controller class
todoCount = QtCore.Property(int)
```

This is how you want to write your code. And also, you want to have a signal, that is triggered when the value of
todoCount changes, you can call that signal something like `todoCountChanged`.

But that is not possible. You have to define a getter and setter for your property, and also a signal for it.

```python
# Inside your controller class

def __init__(self):
    # You need a back variable to hold the value of your property
    self._todoCount = 0


# You need a signal to notify
todoCountChanged = QtCore.Signal(int, arguments=['todoCount'])


# You need a getter
def get_todoCount(self) -> int:
    return self._todoCount


# You need a setter
def set_todoCount(self, value: int):
    if self._todoCount != value:
        self._todoCount = value
        self.todoCountChanged.emit(value)


# And finally, you can define your property
todoCount = QtCore.Property(int, fget=get_todoCount, fset=set_todoCount, notify=todoCountChanged)
```

What the f... is this? 😡

I don’t even want to talk about the type conversions mentioned in `Signals` section. You have to do all these things for
Properties too.

Instead of this sh..., you can use `pywebchannel` library, and define your property like this:

```python
from pywebchannel import Property

# Inside your controller class
todoCount = Property(int, init_val=0)
```

And that’s it. This will:

- ensure that Qt is happy, and your frontend and backend are in sync.
- create a private variable called `_todoCount` to store the value of your property.
- create a getter and setter for you as exactly written above.
- create a signal called `todoCountChanged`

If you want to have a different implementation for your getter and setter, you can still define one or both of them, and
pass it as an argument to `Property`.

## Actions 🕹️

Actions are functions that you can call from your frontend. You can create an action in PySide like this:

```python 
# Inside your controller class
@QtCore.Slot(str)
def sayHello(self, name: str):
    # Do something with todo
    pass
```

This works, and you can call this function from your frontend. But the type issues mentioned above are still there.

```python 
# Inside your controller class
@QtCore.Slot(Todo)
def addTodo(self, todo: Todo):
    # Do something with todo
    pass
```

This does not work, and you will not even get an exception about that. Your function will be called with an empty
argument 😡. Most likely your application will crash, and your frontend will not even know why.

- This is because of one of the input arguments. You have to consider all the input arguments, and make sure that your
  frontend and backend are in sync.
- Return values also have the same problem, ‘type matching’ and ‘keeping’ Qt and serialization happy.
- If you want to notify the frontend about the execution result, you have to create your own signal, and emit it.
- You also have to handle exceptions as well.

You will end up with a lot of boilerplate code, which is not even related to your business logic.

```python
# Inside your controller class

# Create a signal for notification
new_todo_added = QtCore.Signal(dict, arguments=['new_todo'])


# Create a slot for your action
@QtCore.Slot(dict, result=dict)
def addTodo(self, todo: dict):
    try:
        todoObj = Todo.parse_obj(todo)

        # Do something with todo

        self.new_todo_added.emit(todoObj.dict())

        return {'success': True,
                'error': None,
                'data': todoObj.dict()}
    except ParseError as e:
        return {'success': False,
                'error': f"Invalid todo object: {e}",
                'data': None}
    except Exception as e:
        return {'success': False,
                'error': f"Unknown error: {e}",
                'data': None}

```

This is just a simple example, but you can imagine how it will look like in a real application. And even if you handle
this by yourself, you will have a frontend development cycle, with no type-hinting, no auto-completion again.

You can use `pywebchannel` library, and create your action like this:

```python
from pywebchannel import Action, Notify


# Inside your controller class
@Action(Notify([Todo]))
def addTodo(self, todo: Todo):
    # Do something with todo    
    return todo
```

All the problems mentioned above are solved by `pywebchannel` library’s `@Action` decorator. You can focus on your
actual project 😎.

## Okay we almost there 🎰

Imagine that you have created your `Signal`s, `Property`s and `Slot`s etc, in your controller class. But your frontend
still does not recognize your backend types. You have to define all the types in your frontend typescript definition
files, and keep them updated with your backend types. This is a nightmare, and you will have many bugs, and
emotional-damages 😭.

Fortunately `pywebchannel` library has a solution for this. You can use pywebchannel library’s `ts_generator` tool. This
is a simple script that can monitor your python files, and generate typescript definition files automatically. When you
run it in a separate terminal, it will do its magic, and you will have a wonderful development experience 😍.

To use this tool, you have to inherit your controller class from `pywebchannel.Controller` class, and use `pywebchannel`
library’s `Signal`, `Property` and `Action` instead of the ones provided by Qt. Also, you have to use `pydantic` for
your model classes, which is the usual case for model classes in any project. That’s it.

Please check the API documentation and [example projects](https://github.com/cihanuyanik/pywebchannel/tree/main/example)
for more details.
 