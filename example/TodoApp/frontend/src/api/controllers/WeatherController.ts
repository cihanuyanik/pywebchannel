////////////////////////////////////////////////////
// Auto generated file
// Generation time: 2023-12-11 01:59:00
////////////////////////////////////////////////////

import { Signal } from "../models/Signal";
import { Response } from "../models/Response";

// WeatherController interface
export interface WeatherController {
  // Signals
  weatherUpdated: Signal<() => void>;

  // Slots
  getWeather(): Promise<Response>;
}
