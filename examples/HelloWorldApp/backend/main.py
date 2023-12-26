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
