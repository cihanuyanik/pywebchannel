import signal
import sys

from PySide6.QtCore import QCoreApplication

from src.pywebchannel.GeneratorWatcher import GeneratorWatcher

signal.signal(signal.SIGINT, signal.SIG_DFL)

if __name__ == "__main__":
    # Create a QCoreApplication object with the command-line arguments
    app = QCoreApplication(sys.argv)

    # Create a GeneratorWatcher object with the app as the parent
    watcher = GeneratorWatcher(app)

    # Add the directories to watch and their corresponding target directories
    dirsToWatch = [
        "C:/DevelopmentWs/TypescriptGenerator/backend/controllers",
        "C:/DevelopmentWs/TypescriptGenerator/backend/models",
    ]
    dirsAsDesti = [
        "C:/DevelopmentWs/TypescriptGenerator/test",
        "C:/DevelopmentWs/TypescriptGenerator/test",
    ]
    for i in range(len(dirsToWatch)):
        watcher.addDirectory(dirsToWatch[i], dirsAsDesti[i])

    # Execute the app
    app.exec()
