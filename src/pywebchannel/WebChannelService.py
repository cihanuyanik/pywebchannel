from typing import Optional
from PySide6.QtCore import (
    QByteArray,
    QJsonDocument,
    QJsonParseError,
    QObject,
    Signal,
    Slot,
)
from PySide6.QtNetwork import QHostAddress
from PySide6.QtWebChannel import QWebChannel, QWebChannelAbstractTransport
from PySide6.QtWebSockets import QWebSocket, QWebSocketServer

from pywebchannel.Controller import Controller
from pywebchannel.Utils import Logger


# A class that represents a WebSocket transport for QWebChannel
class WebSocketTransport(QWebChannelAbstractTransport):
    """A class that inherits from QWebChannelAbstractTransport and communicates with a QWebSocket.

    Attributes:
        socket (QWebSocket): The QWebSocket object that handles the WebSocket connection.        
    """

    def __init__(self, socket: QWebSocket) -> None:
        """Initializes the WebSocketTransport object with the given socket.

        Args:
            socket (QWebSocket): The QWebSocket object that handles the WebSocket connection.
        """
        # Call the superclass constructor with the socket
        super().__init__(socket)
        # Assign the socket attribute
        self.socket = socket
        # Connect the textMessageReceived signal of the socket to the textMessageReceived slot
        self.socket.textMessageReceived.connect(self.textMessageReceived)
        # Connect the disconnected signal of the socket to the onSocketDisconnected slot
        self.socket.disconnected.connect(self.onSocketDisconnected)

    disconnected = Signal(QWebChannelAbstractTransport)
    """ The signal that is emitted when the socket is disconnected. """

    def __del__(self) -> None:
        """Deletes the WebSocketTransport object and the socket object."""
        # Delete the socket object later
        self.socket.deleteLater()

    @Slot()
    def onSocketDisconnected(self) -> None:
        """Emits the disconnected signal with the self object and deletes the self object and the socket object.

        This slot is invoked when the socket object emits the disconnected signal.
        """
        # Emit the disconnected signal with the self object
        self.disconnected.emit(self)
        # Delete the socket object later
        self.socket.deleteLater()
        # Delete the self object later
        self.deleteLater()

    def sendMessage(self, message) -> None:
        """Sends a message to the WebSocket using the socket object.

        The message is converted to a QJsonDocument and then to a compact JSON string.

        Args:
            message: The message to be sent.
        """
        # Convert the message to a QJsonDocument
        doc = QJsonDocument(message)
        # Send the JSON string of the document using the socket object
        self.socket.sendTextMessage(
            doc.toJson(QJsonDocument.JsonFormat.Compact).toStdString()
        )

    @Slot(str)
    def textMessageReceived(self, messageData: str) -> None:
        """Receives a text message from the WebSocket using the socket object and emits the messageReceived signal.

        The text message is parsed as a QJsonDocument and then as a QJsonObject.
        If there is any error in parsing, the error is logged using the Logger object.

        This slot is invoked when the socket object emits the textMessageReceived signal.

        Args:
            messageData (str): The text message received from the WebSocket.
        """
        # Create a QJsonParseError object
        error = QJsonParseError()
        # Parse the text message as a QJsonDocument
        messageDoc = QJsonDocument.fromJson(
            QByteArray.fromStdString(messageData), error
        )
        # Check if there is any error in parsing
        if error.errorString() != "no error occurred":
            # Log the error of parsing the text message as a JSON object
            Logger.error(
                f"Failed to parse text message as JSON object: {messageData}",
                "WebSocketTransport",
            )
            # Log the error string
            Logger.error(f"Error is: {error.errorString()}", "WebSocketTransport")
            # Return from the slot
            return
        # Check if the document is not a JSON object
        elif not messageDoc.isObject():
            # Log the error of receiving a JSON message that is not an object
            Logger.error(f"Received JSON message that is not an object: {messageData}")
            # Return from the slot
            return
        # Emit the messageReceived signal with the JSON object and the self object
        self.messageReceived.emit(messageDoc.object(), self)


# A class that represents a WebSocket client wrapper for QWebChannel
class WebSocketClientWrapper(QObject):
    """A class that inherits from QObject and handles the WebSocket connections from a QWebSocketServer.

    Attributes:
        server (QWebSocketServer): The QWebSocketServer object that listens for WebSocket connections.
    """

    def __init__(
            self, server: QWebSocketServer, parent: Optional[QObject] = None
    ) -> None:
        """Initializes the WebSocketClientWrapper object with the given server and parent.

        Args:
            server (QWebSocketServer): The QWebSocketServer object that listens for WebSocket connections.
            parent (Optional[QObject], optional): The parent object for the WebSocketClientWrapper. Defaults to None.
        """
        # Call the superclass constructor with the parent
        super().__init__(parent)
        # Assign the server attribute
        self.server = server
        # Connect the newConnection signal of the server to the handleNewConnection slot
        self.server.newConnection.connect(self.handleNewConnection)

    
    clientConnected = Signal(WebSocketTransport)
    """ The signal that is emitted when a new WebSocket connection is established. """
    
    clientDisconnected = Signal(WebSocketTransport)
    """ The signal that is emitted when an existing WebSocket connection is closed. """

    @Slot()
    def handleNewConnection(self) -> None:
        """Creates a WebSocketTransport object for the next pending connection from the server and emits the clientConnected signal.

        This slot is invoked when the server object emits the newConnection signal.
        """
        # Create a WebSocketTransport object for the next pending connection from the server
        wsTransport = WebSocketTransport(self.server.nextPendingConnection())
        # Connect the disconnected signal of the wsTransport to the clientDisconnected signal
        wsTransport.disconnected.connect(self.clientDisconnected)
        # Emit the clientConnected signal with the wsTransport object
        self.clientConnected.emit(wsTransport)


# A class that represents a web channel service for QWebChannel
class WebChannelService(QObject):
    """A class that inherits from QObject and provides a web channel service using QWebSocketServer and QWebChannel.

    Attributes:
        websocketServer (QWebSocketServer): The QWebSocketServer object that provides the WebSocket server.
        port (int): The port number for the WebSocket server.
        serviceName (str): The name of the web channel service.
        clientWrapper (WebSocketClientWrapper): The WebSocketClientWrapper object that handles the WebSocket connections from the server.
        channel (QWebChannel): The QWebChannel object that manages the communication between the server and the clients.
        activeClientCount (int): The number of active WebSocket clients connected to the server.
    """

    def __init__(self, serviceName: str, parent: Optional[QObject] = None) -> None:
        """Initializes the WebChannelService object with the given service name and parent.

        Args:
            serviceName (str): The name of the web channel service.
            parent (Optional[QObject], optional): The parent object for the WebChannelService. Defaults to None.
        """
        # Call the superclass constructor with the parent
        super().__init__(parent)
        # Initialize the websocketServer attribute to None
        self.websocketServer = None
        # Initialize the port attribute to 0
        self.port = 0
        # Assign the serviceName attribute
        self.serviceName = serviceName
        # Initialize the clientWrapper attribute to None
        # noinspection PyTypeChecker
        self.clientWrapper: WebSocketClientWrapper = None
        # Initialize the channel attribute to None
        # noinspection PyTypeChecker
        self.channel: QWebChannel = None
        # Initialize the activeClientCount attribute to 0
        self.activeClientCount = 0

    def start(self, port: int) -> bool:
        """Starts the web channel service by creating and listening to a WebSocket server at the given port.

        Args:
            port (int): The port number for the WebSocket server.

        Returns:
            bool: True if the web channel service is started successfully, False otherwise.
        """
        # Assign the port attribute
        self.port = port
        # Create a QWebSocketServer object with the service name and the non-secure mode
        self.websocketServer = QWebSocketServer(
            self.serviceName, QWebSocketServer.SslMode.NonSecureMode, self
        )
        # Check if the WebSocket server fails to listen at the given address and port
        if not self.websocketServer.listen(address=QHostAddress.Any, port=self.port):
            # Log the error of starting the web channel service
            Logger.error(
                f"Failed to start '{self.serviceName}' at {self.port}", self.serviceName
            )
            # Return False
            return False
        # Connect the closed signal of the WebSocket server to the onClosed slot
        self.websocketServer.closed.connect(self.onClosed)
        # Create a WebSocketClientWrapper object with the WebSocket server
        self.clientWrapper = WebSocketClientWrapper(self.websocketServer)
        # Create a QWebChannel object
        self.channel = QWebChannel()
        # Connect the clientConnected signal of the clientWrapper to the onClientConnected slot
        self.clientWrapper.clientConnected.connect(self.onClientConnected)
        # Connect the clientDisconnected signal of the clientWrapper to the onClientDisconnected slot
        self.clientWrapper.clientDisconnected.connect(self.onClientDisconnected)
        # Log the information of starting the web channel service
        Logger.info(
            f"'{self.serviceName}' is active at PORT={self.port}", self.serviceName
        )
        # Return True
        return True

    def stop(self) -> None:
        """Stops the web channel service by closing and deleting the WebSocket server."""
        # Check if the websocketServer attribute is None
        if self.websocketServer is None:
            # Return from the method
            return
        # Close the WebSocket server
        self.websocketServer.close()
        # Delete the WebSocket server
        self.websocketServer = None

    def isOnline(self) -> bool:
        """Checks if the web channel service is online by checking the status of the WebSocket server.

        Returns:
            bool: True if the web channel service is online, False otherwise.
        """
        # Return True if the websocketServer attribute is not None and the WebSocket server is listening, False otherwise
        return self.websocketServer is not None and self.websocketServer.isListening()

    def registerController(self, controller: Controller) -> None:
        """Registers a controller object to the web channel using the channel attribute.

        Args:
            controller (Controller): The controller object to be registered.
        """
        # Register the controller object to the channel attribute using the name of the controller as the identifier
        self.channel.registerObject(controller.name(), controller)

    @Slot()
    def onClosed(self) -> None:
        """Logs the information of closing the web channel service.

        This slot is invoked when the websocketServer object emits the closed signal.
        """
        # Log the information of closing the web channel service
        Logger.info(f"{self.serviceName} closed", self.serviceName)

    @Slot(WebSocketTransport)
    def onClientConnected(self, transport: WebSocketTransport) -> None:
        """Connects the web channel to the WebSocket transport and increments the active client count.

        This slot is invoked when the clientWrapper object emits the clientConnected signal.

        Args:
            transport (WebSocketTransport): The WebSocketTransport object that represents the WebSocket connection.
        """
        # Connect the channel attribute to the transport object
        self.channel.connectTo(transport)
        # Increment the activeClientCount attribute
        self.activeClientCount = self.activeClientCount + 1
        # Log the information of a new WebSocket connection
        Logger.info(
            f"New Connection (Active client count: {self.activeClientCount})",
            self.serviceName,
        )

    # noinspection PyUnusedLocal
    @Slot(WebSocketTransport)
    def onClientDisconnected(self, transport: WebSocketTransport) -> None:
        """Decrements the active client count and cleans up the controller objects if the active client count is zero.

        This slot is invoked when the clientWrapper object emits the clientDisconnected signal.

        Args:
            transport (WebSocketTransport): The WebSocketTransport object that represents the WebSocket connection.
        """
        # Decrement the activeClientCount attribute
        self.activeClientCount = self.activeClientCount - 1
        # Log the warning of a WebSocket disconnection
        Logger.warning(
            f"Client Disconnected (Active client count: {self.activeClientCount})",
            self.serviceName,
        )
        # Check if the activeClientCount attribute is zero
        if self.activeClientCount == 0:
            # Get the registered objects from the channel attribute
            controllers = self.channel.registeredObjects()
            # Iterate over the keys of the controllers dictionary
            for key in controllers:
                # Get the controller object from the dictionary
                controller: Controller = controllers[key]
                # Log the information of cleaning up the controller object
                Logger.info("Clean up ...", controller.name())
                # Call the cleanup method of the controller object
                controller.cleanup()
