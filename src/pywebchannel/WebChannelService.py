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
from pywebchannel.code_analyzer.utils.Logger import Logger


class WebSocketTransport(QWebChannelAbstractTransport):
    # Construct the transport object and wrap the given socket.
    # The socket is also set as the parent of the transport object.
    def __init__(self, socket: QWebSocket) -> None:
        super().__init__(socket)

        self.socket = socket

        self.socket.textMessageReceived.connect(self.textMessageReceived)
        self.socket.disconnected.connect(self.onSocketDisconnected)

    disconnected = Signal(QWebChannelAbstractTransport)

    # Destroys the WebSocketTransport.
    def __del__(self) -> None:
        self.socket.deleteLater()

    @Slot()
    def onSocketDisconnected(self) -> None:
        self.disconnected.emit(self)
        self.socket.deleteLater()
        self.deleteLater()

    # Serialize the JSON message and send it as a text message via the WebSocket to the client.
    def sendMessage(self, message) -> None:
        doc = QJsonDocument(message)
        self.socket.sendTextMessage(
            doc.toJson(QJsonDocument.JsonFormat.Compact).toStdString()
        )

    # Deserialize the stringified JSON messageData and emit messageReceived.
    @Slot(str)
    def textMessageReceived(self, messageData: str) -> None:
        error = QJsonParseError()
        messageDoc = QJsonDocument.fromJson(
            QByteArray.fromStdString(messageData), error
        )
        if error.errorString() != "no error occurred":
            Logger.error(
                f"Failed to parse text message as JSON object: {messageData}",
                "WebSocketTransport",
            )
            Logger.error(f"Error is: {error.errorString()}", "WebSocketTransport")
            return
        elif not messageDoc.isObject():
            Logger.error(f"Received JSON message that is not an object: {messageData}")
            return

        self.messageReceived.emit(messageDoc.object(), self)


# This code is all that is required to connect incoming WebSockets to the WebChannel. Any kind
# of remote JavaScript client that supports WebSockets can thus receive messages and access the
# published objects.

# Construct the client wrapper with the given parent.

# All clients connecting to the QWebSocketServer will be automatically wrapped
# in WebSocketTransport objects.


class WebSocketClientWrapper(QObject):
    def __init__(
            self, server: QWebSocketServer, parent: Optional[QObject] = None
    ) -> None:
        super().__init__(parent)

        self.server = server

        # connect new connection signal
        self.server.newConnection.connect(self.handleNewConnection)

    clientConnected = Signal(WebSocketTransport)
    clientDisconnected = Signal(WebSocketTransport)

    @Slot()
    def handleNewConnection(self) -> None:
        wsTransport = WebSocketTransport(self.server.nextPendingConnection())
        wsTransport.disconnected.connect(self.clientDisconnected)

        self.clientConnected.emit(wsTransport)


class WebChannelService(QObject):
    def __init__(self, serviceName: str, parent: Optional[QObject] = None) -> None:
        super().__init__(parent)
        self.websocketServer = None
        self.port = 0
        self.serviceName = serviceName
        self.clientWrapper: WebSocketClientWrapper = None
        self.channel: QWebChannel = None
        self.activeClientCount = 0

    def start(self, port: int) -> bool:
        self.port = port
        self.websocketServer = QWebSocketServer(
            self.serviceName, QWebSocketServer.SslMode.NonSecureMode, self
        )

        if not self.websocketServer.listen(address=QHostAddress.Any, port=self.port):
            Logger.error(
                f"Failed to start '{self.serviceName}' at {self.port}", self.serviceName
            )
            return False

        self.websocketServer.closed.connect(self.onClosed)

        # Wrap WebSocket clients in QWebChannelAbstractTransport objects
        self.clientWrapper = WebSocketClientWrapper(self.websocketServer)

        # set up the channel
        self.channel = QWebChannel()

        # self.clientWrapper.clientConnected.connect(self.channel.connectTo)
        self.clientWrapper.clientConnected.connect(self.onClientConnected)
        self.clientWrapper.clientDisconnected.connect(self.onClientDisconnected)

        Logger.info(
            f"'{self.serviceName}' is active at PORT={self.port}", self.serviceName
        )
        return True

    def stop(self) -> None:
        if self.websocketServer is None:
            return

        self.websocketServer.close()
        self.websocketServer = None

    def isOnline(self) -> bool:
        return self.websocketServer is not None and self.websocketServer.isListening()

    def registerController(self, controller: Controller) -> None:
        self.channel.registerObject(controller.name(), controller)

    @Slot()
    def onClosed(self) -> None:
        Logger.info(f"{self.serviceName} closed", self.serviceName)

    @Slot(WebSocketTransport)
    def onClientConnected(self, transport: WebSocketTransport) -> None:
        self.channel.connectTo(transport)
        self.activeClientCount = self.activeClientCount + 1
        Logger.info(
            f"New Connection (Active client count: {self.activeClientCount})",
            self.serviceName,
        )

    @Slot(WebSocketTransport)
    def onClientDisconnected(self, transport: WebSocketTransport) -> None:
        self.activeClientCount = self.activeClientCount - 1
        Logger.warning(
            f"Client Disconnected (Active client count: {self.activeClientCount})",
            self.serviceName,
        )

        if self.activeClientCount == 0:
            controllers = self.channel.registeredObjects()

            for key in controllers:
                controller: Controller = controllers[key]
                Logger.info("Clean up ...", controller.name())
                controller.cleanup()
