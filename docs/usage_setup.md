# Usage Setup ⚙️:

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
behaviour on your it. The console on the browser could be helpful to debug the problem.