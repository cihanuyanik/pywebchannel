<details open>
<summary><h1>What is Python Web Channel❓</h1></summary>

## Python Web Channel 🚀

`pywebchannel` is a tool that automatically generates TypeScript files for QWebChannel Python local backend. It
allows you to create a stunning UI for your Python project using web technologies such as HTML, CSS, and JavaScript.

With `pywebchannel`, you can:

- Write your backend logic in Python and use Qt (PySide6) for communication.
- Use QWebChannel to communicate with the web frontend and expose your Python objects and methods.
- Write your frontend UI in any web framework of your choice, such as vanilla JS, React, Solid, Vue, etc.
- Enjoy the benefits of TypeScript, such as type safety, code completion, and error detection.
- Save time and effort by automatically generating TypeScript interfaces from your Python code.

## Type-Script Generator ⚙️

The TypeScript Generator part of this library has a file watcher that translates Python code to TypeScript interfaces.
This enables safe and easy communication between your Python backend and your desired frontend (vanilla JS, React,
Solid,
Vue, etc.). To use the TypeScript Generator, run the `ts_generator.py` script and specify the folders that contain the
Python files you would like watch for auto-instant conversion.

## Controller Utilities

`pywebchannel` provides helpful classes, functions and decorators to generate proper controller classes which can be
exposed to a UI written by using web technologies. All given types are self documented and easy to follow.

[Documentation & API](https://pywebchannel.readthedocs.io)</details><details>
<summary><h1>Why do you need this? 🤔</h1></summary>

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
-

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
 </details><details>
<summary><h1>Installation 🔃</h1></summary>

You can simply install the package using pip:

```bash
pip install pywebchannel
```

All requirements will be installed automatically.

Requirements:

- [PySide6](https://doc.qt.io/qtforpython-6/) - Qt for Python
- [pydantic](https://docs.pydantic.dev/latest/) - Model definition and validation
- [colorama](https://pypi.org/project/colorama/) - Colored terminal output

</details><details>
<summary><h1>Usage Setup ⚙️:</h1></summary>

## Definition 1: Business Logic / A python project / Backend 🐍

Whatever you call for this step, it is just a regular Qt (PySide6) powered python project, which can take the
advantage of full power of python with no limitation. To simplify the discussion here, it uses web socket(s) for real
time communication and exposes objects through web socket(s). The `properties`, `methods`, `signal`/`notifiers`
immediately become available to the UI with complete signature and type checking through type-script interfaces. Don't
worry about complicated processes for managing sockets, it is not your responsibility. This is handled automatically,
you can simply focus on your project.

## Definition 2: User Interface / A web project / Frontend 💻

Similarly, it is just a regular web project, which exploit the available modern UI tools. There is no limitation
such as magically manipulated `window` interfaces or any complicated middle-ware translator which limits the
functionality web library of yours.

## `Step 1`: Create a meaningful directory structure.

It is completely up to you. But having a meaningful directory
structure could make things simpler. For that purpose suggested way is to create a root directory with your `AppName`
and two folders under the root directory, `backend` and `frontend`. As names suggest, they will be holding your
python project as `backend` and UI project as `frontend.

```
📦AppName
 ┣ 📂backend
 ┃  ┣ ...
 ┣ 📂frontend
 ┃  ┣ ...
 ┣ 📜README.md
 ┣ 📜LICENSE
 ┣ 📜.gitignore
```

`Optinal virtual environment`: If you prefer using virtual environment for your python projects (which is the
suggested way for any python project), create one virtual environment, and use it under your `backend` folder.

----------------------------------------------------------------

## `Step 2`: Install the library `pywebchannel`

```
pip install pywebchannel
```

----------------------------------------------------------------

## `Step 3`: Create an entry point for your `backend`.

Add a main file with any name, i.e. `main.py`, inside
your `backend` folder. The entry point will contain python `main` function and will create a `QApplication` and run
it. The responsibility of the entry point is to initiate the `WebChannelService` object(s) (Yes, you read it right,
it is plural, you can create more than one communication channels to your UI application, for different purposes).
Addition to that `main` needs to create the object(s) (at least the ones which need to be available at the beginning),
and register those object(s) to the related `WebChannelService`.

```python 
# main.py
import sys
from PySide6.QtWidgets import QApplication

from pywebchannel import WebChannelService

if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Create a WebChannelService with a desired serviceName and the parent QObject
    commandTransferService = WebChannelService("Command Transfer Service", app)
    # Start the service with a desired port number, 9000 in this example
    commandTransferService.start(9000)

    ...
    ...
    ...

    app.exec()
```

----------------------------------------------------------------

## `Step 4`: Create a python package

To hold classes which contains functionalities to be invoked from `frontend`.
Typically, it is better to create two packages, one for functionality classes and one for fixed structured objects,
even though the second one is optional, it is completely okay to create it, no harm will be done if it is empty. The
names of these folders could be anything, but having meaningful names would be helpful. Let's call
them `controllers`, `models` respectively.

```
📦AppName
 ┣ 📂backend
 ┃  ┣ 📂controllers
 ┃  ┃  ┣ 🐍__init__.py
 ┃  ┣ 📂models
 ┃  ┃  ┣ 🐍__init__.py
 ┣ 📂frontend
 ┃  ┣ ...
 ┣ 🐍main.py
 ┣ 📜README.md
 ┣ 📜LICENSE
 ┣ 📜.gitignore
```

----------------------------------------------------------------

## `Step 5`: Create a controller class under your `controllers` package.

This is going to be one of the Type you are
going to expose to your UI. Let's call it `HelloWorldController`. And make this class derived
from `Controller`, which is imported from `pywebchannel`. Then, in your `main`, create an instance of it and register
it into the `WebChannelService`.

```python
# controllers/HelloWorldController.py
from typing import Optional
from PySide6.QtCore import QObject
from pywebchannel import Controller


# Create a Controller class
class HelloWorldController(Controller):
    def __init__(self, parent: Optional[QObject] = None):
        # Controller name is typically the name of the class '__name__' attribute could be used as well
        super().__init__("HelloWorldController", parent)
```

And in main:

```python
# main.py
import sys
from PySide6.QtWidgets import QApplication
from pywebchannel import WebChannelService
from controllers.HelloWorldController import HelloWorldController

if __name__ == "__main__":
    app = QApplication(sys.argv)
    commandTransferService = WebChannelService("Command Transfer Service", app)
    commandTransferService.start(9000)

    # Create hello world controller object
    hwController = HelloWorldController(app)
    # Register controller for the communication service
    commandTransferService.registerController(hwController)

    app.exec()

```

----------------------------------------------------------------

## `Step 6:` Add functionality

Technically, at this point our object, `hwController` has been already exposed to the any target UI. The
functionality and properties of it is already accessible through a websocket located at port number 9000. The problem
is that there is no functionality in our controller yet. Let's add a method into our controller, and decorate this
method with a decorator named `Action` imported from `pywebchannel`

```python
# controllers/HelloWorldController.py
from typing import Optional
from PySide6.QtCore import QObject
from pywebchannel import Controller, Action


class HelloWorldController(Controller):
    def __init__(self, parent: Optional[QObject] = None):
        super().__init__("HelloWorldController", parent)

    # Create a class method and decorate it with @Action() decorator.
    # Don't forget to put annotations in your arguments. It is important!
    @Action()
    def sayHello(self, name: str):
        return f"Hello from 'HelloWorldController.sayHello' to my friend {name}"
```

----------------------------------------------------------------

## `Step 7`: Create UI project

Now, we can try to use this inside a web app. For simplicity, inside the `frontend`, just create a `Vite`
project with `vanilla typescript` template. You can create it yourself easily, or you can take it from `examples`
folder.

----------------------------------------------------------------

## `Step 8`: Establish connection

To establish connection between your backend and frontend, it is necessary to open a websocket connection
from frontend to backend. Luckily, we can use built-in `WebSocket` in our frontend project. First create an `api` folder
under your `src` and `qwebchannel` under that. Then populate the folder with given helpers in the repository
examples (Just copy and paste the content into your project). Addition to those, you can create `controllers`
and `models` directories as well, for nicely formatted structure.

```
📦AppName
 ┣ 📂backend
 ┃  ┣ 📂controllers
 ┃  ┃  ┣ 🐍__init__.py
 ┃  ┃  ┣ 🐍HelloWorldController.py
 ┃  ┣ 📂models
 ┃  ┃  ┣ 🐍__init__.py
 ┣ 📂frontend
 ┃  ┣ 📂node_modules 
 ┃  ┣ 📂public
 ┃  ┣ 📂src
 ┃  ┃  ┣ 📂api
 ┃  ┃  ┃  ┣ 📂controllers
 ┃  ┃  ┃  ┣ 📂models
 ┃  ┃  ┃  ┣ 📂qwebchannel
 ┃  ┃  ┃  ┃  ┣📜index.d.ts
 ┃  ┃  ┃  ┃  ┣📜index.js 
 ┃  ┃  ┃  ┃  ┣📜reeadme.txt
 ┃  ┃  ┣📜main.ts
 ┃  ┃  ┣📜vite-env-d.ts
 ┃  ┣📜index.html
 ┃  ┣📜package.json
 ┃  ┣📜tsconfig.json
 ┃  ┣📜.gitignore 
 ┣ 🐍main.py
 ┣ 📜README.md
 ┣ 📜LICENSE
 ┣ 📜.gitignore
```

----------------------------------------------------------------

## `Step 9`: Add QWebChannel javascript interface

`api/qwebchannel/index.js` is the official QWebChannel javascript interface. However, it is different than
the original (`index_org.js`) one. It has been updated to support `async`/`await` pattern instead of old-school
callback style usage. Addition to that a typescript definition has been attached as well, `index.d.ts`.

----------------------------------------------------------------

## `Step 10`: Websocket Helper

Now, create a class to handle the websocket communication boiler-plate. You can use given `BaseAPI.ts`
and `CommandAPI.ts` from the repository. The important part here is the implementation of `onChannelReady` callback
located under `CommandAPI.ts`. This is the part where you access your object exposed from `backend` . As you guess,
this access will be storing the reference to that object inside our API object, so that we can use it whenever we need
it. Update the `CommandAPI.ts` for learning purposed debugging

```typescript
// Inside CommadAPI.ts copied from repository
export class CommandAPI extends BaseAPI {
  public constructor() {
    super("ws://localhost:9000", "Command Transfer Service");
  }

  // Update this part to see the channel content.
  async onChannelReady(channel: QWebChannel): Promise<void> {
    console.log(channel)
  }
}
```

Then add connection request into your `main.ts`

```typescript
// main.ts
// import API
import {API} from "./api/CommandAPI.ts";

// Try to connect
API.connect().then(() => {
  if (API.isConnected()) {
    console.log("Successfully connected to backend")
  }
}).catch((error) => {
  console.log(error)
})

// Add a simple UI
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div> 
    <input id="input">
    <button id="button">Say Hi</button>
  </div>
`

const input = document.querySelector<HTMLInputElement>('#input');
const button = document.querySelector<HTMLButtonElement>('#button');
button?.addEventListener('click', () => {
  console.log(input?.value)
})
```

----------------------------------------------------------------

## `Step 11:` Run the projects

Now, run the `backend` project, and run the `frontend` project. If everything is correct, you should see an
output from `backend` terminal:

```
[INFO] - Command Transfer Service: 'Command Transfer Service' is active at PORT=9000
[INFO] - Command Transfer Service: New Connection (Active client count: 1)
```

and something similar from `frontend` browser console.

```
QWebChannel {...}
Successfully connected to backend
```

When you expand the `QWebChannel` object on the console, you should see an `objects` and `HelloWorldController` inside
it. If this is the case, you have successfully connected your python backend to your frontend

----------------------------------------------------------------

## `Step 12`: Use it

Let's use it and let our `backend` say hello to `frontend`'. Just update your code as it should be:

Update `CommandAPI.ts`

```typescript

export class CommandAPI extends BaseAPI {
  // Add an attribute for our API object
  HelloWorldController!: any;

  public constructor() {
    super("ws://localhost:9000", "Command Transfer Service");
  }

  async onChannelReady(channel: QWebChannel): Promise<void> {
    // Initialize it by the object located inside the QWebChannel
    this.HelloWorldController = channel.objects.HelloWorldController;
  }
}
```

Update `main.ts`

```typescript
button?.addEventListener('click', async () => {
  // Call say hello with input value taken from input text box
  const response = await API.HelloWorldController.sayHello(input?.value)
  if (response.error) {
    // if an error occurred, display it
    console.log(response.error)
    return
  }

  if (response.success) {
    // if a success message has been received, display it
    alert(response.success)
    return
  }

  if (response.data) {
    // if an extra data has been received, display it
    alert(JSON.stringify(response.data))
    return
  }
})
```

Refresh your web page, and click the button. You should see an alert message saying
`Hello from 'HelloWorldController.sayHello' to my friend <your input value>`

----------------------------------------------------------------

## `Step 13`: Type hinting

Everything is ready to go. The ONLY MISSING part is type hint in our `frontend`, because we don't have any type
defintion for our controller, `HelloWorldController`. Type script generator given by `pywebchannel` comes in play at
this moment.

- `Step 1:` Copy `ts_generator.py` and Paste it into your `backend` root folder, same level with your `main.py`.

- `Step 2:` Check the folder paths written in `ts_generator.py` script

- `Step 3:` Run it in separate terminal.

```
python ts_generator.py
```

- `Step 4:` You will see that the controller folder will be populated with an auto generated Type-script
  interface, `api/controllers/HelloWorldController.ts`

- `Step 5:` Since it needs to use `Response` interface for type-hinting for return values, it needs to be located
  inside `api/models` directory, which is not there yet. Please copy it from the repoository. And also copy the `Signal`
  interface as well, which is going to be necessary when you use signals.

- `Step 6:` Now return back to your `button.click` listener implementation in `main.ts`. You will see that the
  function, `sayHello(...)`, the return value `response` all are taking advantage of type-hinting.

----------------------------------------------------------------

## `The last step`: Finalize your UI and serve it

When you complete your UI, you can serve it inside your `backend` project.
For that purpose, you have a couple of options as usual.

First of all, you need to build your UI project. Inside your UI project, run:

```
npm run build
```

This is going to create a `dist` folder inside your UI project, `frontend/dist`.
Copy `dist` folder into your `backend` project, and rename it with a meaningful name, such as `app_ui`.

Since it is a `javascript` based web project, opening the html file is not enough. The `javascript` functionalities
will not be available. For that purpose, you need to serve it through a web server.

You can use the given `HttpServer` class inside `pywebchannel` for that purpose. It is a simple `http` server, which
serves the given folder. Then you can access your UI through a browser, or even better, you can use `QWebEngineView` to
display it

Please update your `main.py` file as follows. Feel free to use all the features you deserve from `QWebEngineView`:

```python
# main.py
import sys

from PySide6.QtCore import QUrl
from PySide6.QtWebEngineCore import QWebEngineSettings
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWidgets import QApplication

from controllers.HelloWorldController import HelloWorldController
from pywebchannel import WebChannelService, HttpServer

if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Create a WebChannelService with a desired serviceName and the parent QObject
    commandTransferService = WebChannelService("Command Transfer Service", app)
    # Start the service with a desired port number, 9000 in this example
    commandTransferService.start(9000)

    # Create hello world controller object
    hwController = HelloWorldController(app)
    # Register controller for the communication service
    commandTransferService.registerController(hwController)

    # Create http server and start it
    UI_PORT = 12000
    httpServer = HttpServer("app_ui", UI_PORT, app)
    httpServer.start()

    # Website on QTGui
    view = QWebEngineView()
    view.settings().setAttribute(QWebEngineSettings.WebAttribute.PluginsEnabled, True)
    view.settings().setAttribute(QWebEngineSettings.WebAttribute.DnsPrefetchEnabled, True)
    view.load(QUrl(f"http://localhost:{UI_PORT}/"))
    view.setWindowTitle("Hello World App")
    view.show()

    app.exec()
```

This will spin a web server at port `12000`, and serve the `app_ui` folder. You can access your UI through
a browser by typing `http://localhost:12000` into the address bar. This could be helpful, if you observe any weird
behaviour on your it. The console on the browser could be helpful to debug the problem.</details><details>
<summary><h1>Congratulations!!! ✌️🎈🎊</h1></summary>

You've successfully linked your Python backend to the frontend, introducing a tool capable of dynamically generating
TypeScript interfaces by monitoring backend changes. This tool ensures that your frontend remains synchronized with
backend updates, streamlining the development process.

As long as the tool is active, it automatically updates scripts as you modify the backend, maintaining consistency
between the two worlds. Now, you can explore additional examples and delve into the self-explanatory API.

Consider the following steps as you continue to enhance your development process:

1. Documentation and Usage Guidelines:

- Develop comprehensive documentation to guide users on effectively utilizing the tool.
- Provide clear instructions on structuring the backend code to optimize the automatic generation of TypeScript
  interfaces.

2. Expand Script Generation:

- Explore opportunities to extend the tool's capabilities beyond TypeScript interfaces, such as generating API
  documentation or other relevant artifacts based on backend modifications.

3. User Interface for the Tool:

- Enhance accessibility by creating a user interface for the tool, catering to developers who may prefer graphical
  interfaces over command-line tools.
- Implement features like configurable options and settings to further customize the tool's behavior.</details><details>
<summary><h1>How to Contribute 🙌</h1></summary>

If you want to contribute to this project, you are more than welcome. Here are some ways you can help:

- Report any bugs or issues you find.
- Suggest new features or improvements.
- Submit pull requests with your code changes.
- Share your feedback or suggestions.</details><details>
<summary><h1>License 📄</h1></summary>

This project is licensed under the MIT License. See
the [LICENSE](https://github.com/cihanuyanik/pywebchannel/blob/main/LICENSE) file for details.</details><details>
<summary><h1>Credits 🙏</h1></summary>

This project was inspired by the following sources:

- [QWebChannel](https://doc.qt.io/qt-5/qwebchannel.html) - a Qt module that enables seamless integration of C++ and
  HTML/JavaScript.
- [PySide6](https://www.qt.io/qt-for-python) - a Python binding of the cross-platform GUI toolkit Qt.
- [TypeScript](https://www.typescriptlang.org/) - a superset of JavaScript that adds optional types.</details>