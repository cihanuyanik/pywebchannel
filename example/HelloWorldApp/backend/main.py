import sys
from PySide6.QtWidgets import QApplication

from controllers.HelloWorldController import HelloWorldController
from pywebchannel import WebChannelService

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

    app.exec()
