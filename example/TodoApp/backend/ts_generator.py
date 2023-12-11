import signal
import sys

from PySide6.QtCore import QCoreApplication

from pywebchannel import GeneratorWatcher

signal.signal(signal.SIGINT, signal.SIG_DFL)

if __name__ == "__main__":
    # Create a QCoreApplication object with the command-line arguments
    app = QCoreApplication(sys.argv)

    # Create a GeneratorWatcher object with the app as the parent
    watcher = GeneratorWatcher(app)

    # Add the directories to watch and their corresponding target directories
    dirsToWatch = [
        "controllers",
        "models",
    ]
    dirsAsDesti = [
        "../frontend/src/api/controllers",
        "../frontend/src/api/models",
    ]
    for i in range(len(dirsToWatch)):
        watcher.addDirectory(dirsToWatch[i], dirsAsDesti[i])

    # Execute the app
    app.exec()
