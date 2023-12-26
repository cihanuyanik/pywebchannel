from typing import Optional

from PySide6.QtCore import QObject

from pywebchannel.Controller import Controller, Signal, Action


class WeatherController(Controller):
    def __init__(self, parent: Optional[QObject] = None):
        super().__init__("WeatherController", parent)

    weatherUpdated = Signal({})

    @Action()
    def getWeather(self):
        return "Weather"
