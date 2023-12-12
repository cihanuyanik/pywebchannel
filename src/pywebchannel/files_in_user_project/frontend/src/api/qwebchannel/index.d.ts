export {};

declare global {
  export const enum QWebChannelMessageTypes {
    signal = 1,
    propertyUpdate = 2,
    init = 3,
    idle = 4,
    debug = 5,
    invokeMethod = 6,
    connectToSignal = 7,
    disconnectFromSignal = 8,
    setProperty = 9,
    response = 10,
  }

  export type QWebChannelTransport = {
    webChannelTransport: any;
  };

  export class QWebChannel {
    constructor(
      transport: WebSocket,
      initCallback?: (channel: QWebChannel) => void
    );

    objects: any;
    transport: WebSocket;
    usedConverters: Array<Function>;
    execCallbacks: any;
    execId: number;

    addConverter(converter: string | Function): void;
    send(data: any): void;
    exec(data: any, callback: (data: any) => void): void;
    handleSignal(message: MessageEvent): void;
    handleResponse(message: MessageEvent): void;
    handlePropertyUpdate(message: MessageEvent): void;
    debug(message: any): void;
  }

  export class QObject {
    constructor(name: string, data: any, webChannel: QWebChannel);

    __id__: string;
    __objectSignals__: any;
    __propertyCache__: any;

    unwrapQObject(response: any): any;
    unwrapProperties(): any;
    propertyUpdate(signals: any, propertyMap: any): void;
    signalEmitted(signalName: string, signalArgs: any): void;
  }
}
