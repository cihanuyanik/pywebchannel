/**
 * An abstract base class for API communication using WebSockets and QWebChannel.
 */
export abstract class BaseAPI {
  // The URL of the backend socket
  protected _backend_socket_url: string;
  // The name of the service
  protected _serviceName: string;
  // The WebSocket instance
  protected _ws: WebSocket;
  // The QWebChannel instance
  protected channel!: QWebChannel;

  /**
   * Constructs a BaseAPI instance with the given URL and service name.
   * @param url The URL of the backend socket
   * @param serviceName The name of the service
   */
  protected constructor(url: string, serviceName: string) {
    this._backend_socket_url = url;
    this._serviceName = serviceName;
    // @ts-ignore
    // Initialize the WebSocket as null
    this._ws = null;
  }

  /**
   * An abstract method that is called when the QWebChannel is ready.
   * @param channel The QWebChannel instance
   * @returns A promise that resolves when the channel is ready
   */
  abstract onChannelReady(channel: QWebChannel): Promise<void>;

  /**
   * Checks if the WebSocket is connected and open.
   * @returns A boolean value indicating the connection status
   */
  public isConnected() {
    // Return true if the WebSocket is not null and its ready state is open
    return this._ws && this._ws.readyState === WebSocket.OPEN;
  }

  /**
   * Connects to the backend socket and creates a QWebChannel instance.
   * @returns A promise that resolves when the connection is established
   */
  public async connect() {
    return new Promise(async (resolve, reject) => {
      // If the WebSocket is already connected, resolve the promise and return
      if (this.isConnected()) {
        resolve(true);
        return;
      }

      // Create a new WebSocket with the backend socket URL
      this._ws = new WebSocket(this._backend_socket_url);

      // Reject the promise if there is an error in the WebSocket
      this._ws.onerror = () =>
        reject(`Error connecting to ${this._serviceName}`);

      // Reject the promise if the WebSocket is closed
      this._ws.onclose = () =>
        reject(`${this._serviceName} connection closed`);

      // Create a new QWebChannel with the WebSocket when it is open
      this._ws.onopen = (e) =>
        new QWebChannel(this._ws, async (channel: QWebChannel) => {
          // Assign the channel to the instance attribute
          this.channel = channel;
          // Call the abstract method onChannelReady with the channel
          await this.onChannelReady(channel);
          // Resolve the promise with the event
          resolve(e);
        });
    });
  }

  /**
   * Disconnects from the backend socket and closes the WebSocket.
   * @returns A promise that resolves when the connection is closed
   */
  public async disconnect() {
    return new Promise((resolve, reject) => {
      // Close the WebSocket with code 1000 (normal closure)
      this._ws.close(1000);
      // Resolve the promise when the WebSocket is closed
      this._ws.onclose = (e) => resolve(e);
      // Reject the promise if there is an error in the WebSocket
      this._ws.onerror = (e) => reject(e);
    });
  }
}
