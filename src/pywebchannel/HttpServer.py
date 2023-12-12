from PySide6.QtCore import QObject, QProcess, Slot

from pywebchannel.Utils import Logger


class HttpServer(QObject):
    def __init__(self, serverDir: str, port: int, parent=None) -> None:
        super().__init__(parent)
        self.process = QProcess(parent)
        self.port = port
        self.serverDir = serverDir
        # noinspection PyUnresolvedReferences
        self.process.readyReadStandardOutput.connect(
            self.onReadyReadStandardOutput)
        # noinspection PyUnresolvedReferences
        self.process.readyReadStandardError.connect(
            self.onReadyReadStandardError)

        self.parent().aboutToQuit.connect(self.stop)

    def start(self) -> None:
        self.process.start("python", ["-m", "http.server", f"{self.port}",
                                      "--directory", self.serverDir])

    @Slot()
    def stop(self) -> None:
        Logger.info("Stopping http server", "HttpServer")
        self.process.kill()

    @Slot()
    def onReadyReadStandardOutput(self) -> None:
        Logger.status(
            self.process.readAllStandardOutput().toStdString(), "HttpServer")

    @Slot()
    def onReadyReadStandardError(self) -> None:
        Logger.status(
            self.process.readAllStandardError().toStdString(), "HttpServer")
