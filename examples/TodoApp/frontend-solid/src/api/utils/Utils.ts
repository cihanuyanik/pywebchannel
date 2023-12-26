export type SlotType = (...args: any[]) => void;
export type ConnectType = (callback: SlotType) => void;
export type SignalType = {
  connect: ConnectType;
  disconnect: ConnectType;
};

export type DisconnectType = () => void;

/**
 * Backend "Qt Signal" and solidjs store attribute connector
 *
 * @param signal Qt Signal which is going to be listened
 * @param slot The callback function to be called when signal emitted
 * @param name Optional signal name
 */
export function connect(
  signal: SignalType,
  slot: SlotType,
  name: string = "",
): DisconnectType {
  signal.connect(slot);

  // return connection corresponding disconnect call
  return () => {
    signal.disconnect(slot);
  };
}

/**
 * Make auto connections between backend api signals and SolidJs store
 * It helps on making connections for Properties and their notification signals
 * Custom signals, which are not dedicated for any property, must be connected manually
 *
 * @param store SolidJs store object
 * @param APIState Backend API object containing Qt Signals
 * @param set SolidJs store setter function
 * @returns listener list (available for disconnect)
 */
export function autoConnectAPISignalsToStore(
  store: any,
  APIState: any,
  set: any,
) {
  const disconnectCalls = new Array<DisconnectType>();

  const apiObjectName = APIState.__id__;

  for (const storeKey of Object.keys(store)) {
    // Ignore functions
    if (typeof store[storeKey] === "function") continue;
    // Get signal
    const apiSignalName = `${storeKey}Changed`;
    const apiSignal = APIState[apiSignalName];
    // If it is existed, make connection
    if (apiSignal) {
      disconnectCalls.push(
        connect(
          apiSignal,
          (v: any) => set(storeKey, v),
          `${apiObjectName}.${apiSignalName}`,
        ),
      );
    }
    // Retrieve first value
    const firstValue = APIState[storeKey];
    // If it is existed, set store state
    if (firstValue !== undefined) set(storeKey, firstValue);
  }

  return disconnectCalls;
}

/**
 * @brief A class that manages Qt WebChannel connections in a TypeScript project.
 *
 * This class is a wrapper for connecting and disconnecting signals and slots
 * using the Qt WebChannel module. It also provides a method to automatically connect
 * signals from an APIState object to slots that update a store object.
 */
export class SignalConnectionManager {
  /**
   * @brief An array of functions that can disconnect signals from slots.
   */
  private _disconnectCalls: Array<DisconnectType> = [];
  /**
   * @brief The constructor of the class.
   */
  public constructor() {}

  /**
   * @brief A method that automatically connects signals from an APIState object
   * to slots that update a store object.
   *
   * This method iterates over the keys of the store object and checks if there
   * is a corresponding signal in the APIState object. If there is, it connects
   * the signal to a slot that updates the store with the new value. It also sets
   * the initial value of the store from the APIState object.
   *
   * @param store The store object that holds the state of the application.
   * @param setStore The function that can update the store object with a new value.
   * @param APIState The APIState object that contains the signals and properties
   * of the server-side QObjects.
   */
  public autoConnect(store: any, setStore: any, APIState: any) {
    const apiObjectName = APIState.__id__;

    // Use Object.entries to get both key and value of store
    for (const [storeKey, storeValue] of Object.entries(store)) {
      // Ignore functions
      if (typeof storeValue === "function") continue;
      // Get signal
      const apiSignalName = `${storeKey}Changed`;
      const apiSignal = APIState[apiSignalName];
      // If it is existed, make connection
      if (apiSignal) {
        this.connect(
          apiSignal,
          (v: any) => setStore(storeKey, v),
          `${apiObjectName}.${apiSignalName}`,
        );
      }
      // Retrieve first value
      const firstValue = APIState[storeKey];
      // If it is existed, set store state
      if (firstValue !== undefined) setStore(storeKey, firstValue);
    }
  }

  /**
   * @brief A method that connects a signal to a slot.
   *
   * This method connects signal and slot. It also adds a function to the _disconnectCalls
   * array that can disconnect the signal from the slot later.
   *
   * @param signal The signal object that emits the value changes.
   * @param slot The slot function that receives the value changes and performs some actions.
   * @param name The optional name of the signal and slot connection for debugging purposes.
   */
  public connect<T>(signal: SignalType, slot: SlotType, name: string = "") {
    signal.connect(slot);
    this._disconnectCalls.push(() => signal.disconnect(slot));
  }

  /**
   * @brief A method that disconnects all the signals from their slots.
   *
   * This method calls all the functions in the _disconnectCalls array to
   * disconnect all the signals from their slots. It also clears the array.
   */
  disconnectAll() {
    // Use a for loop to iterate over the array in reverse order
    for (const f of this._disconnectCalls) {
      if (f) f();
    }
    // Use the splice method to clear the array
    this._disconnectCalls.splice(0, this._disconnectCalls.length);
  }
}

export const SignalConnManager = new SignalConnectionManager();
