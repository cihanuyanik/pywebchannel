import { BaseAPI } from "./BaseAPI";
import { QWebChannel } from "./qwebchannel";
import { TodoController } from "./controllers/TodoController.ts";

/**
 * A subclass of BaseAPI that handles commands for the TodoController.
 */
export class CommandAPI extends BaseAPI {
  // TODO: YOUR EXPOSED OBJECTS HERE
  TodoController!: TodoController;

  /**
   * Constructs a CommandAPI instance with the default URL and service name.
   */
  public constructor() {
    // Call the super constructor with the URL and service name
    super("ws://localhost:9000", "Command Transfer Service");
  }

  /**
   * Overrides the onChannelReady method of the BaseAPI class.
   * @param channel The QWebChannel instance
   * @returns A promise that resolves when the channel is ready
   */
  async onChannelReady(channel: QWebChannel): Promise<void> {
    this.TodoController = channel.objects.TodoController;
  }
}

// Export a new CommandAPI instance as API
export const API = new CommandAPI();
