import signal
import sys

from PySide6.QtWidgets import QApplication

from controllers.TodoController import TodoController
from controllers.WeatherController import WeatherController
from pywebchannel import WebChannelService

signal.signal(signal.SIGINT, signal.SIG_DFL)

if __name__ == "__main__":
    app = QApplication(sys.argv)

    todoController = TodoController(app)

    weatherController = WeatherController(app)

    commandTransferService = WebChannelService("Command Transfer Service", app)
    commandTransferService.start(9000)

    commandTransferService.registerController(todoController)
    commandTransferService.registerController(weatherController)

    app.exec()
