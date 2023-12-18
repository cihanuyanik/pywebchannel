import signal
import sys

from PySide6.QtCore import QUrl
from PySide6.QtWebEngineCore import QWebEngineSettings
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWidgets import QApplication

from controllers.TodoController import TodoController
from controllers.WeatherController import WeatherController
from pywebchannel import WebChannelService, HttpServer

signal.signal(signal.SIGINT, signal.SIG_DFL)

if __name__ == "__main__":
    app = QApplication(sys.argv)

    todoController = TodoController(app)

    weatherController = WeatherController(app)

    commandTransferService = WebChannelService("Command Transfer Service", app)
    commandTransferService.start(9000)

    commandTransferService.registerController(todoController)
    commandTransferService.registerController(weatherController)

    # Create http server and start it
    UI_PORT = 12000
    httpServer = HttpServer("app_ui_qwik", UI_PORT, app)
    httpServer.start()

    # Website on QTGui
    view = QWebEngineView()
    view.settings().setAttribute(QWebEngineSettings.WebAttribute.PluginsEnabled, True)
    view.settings().setAttribute(QWebEngineSettings.WebAttribute.DnsPrefetchEnabled, True)
    view.load(QUrl(f"http://localhost:{UI_PORT}/"))
    view.setWindowTitle("Todo App")
    view.show()

    app.exec()
