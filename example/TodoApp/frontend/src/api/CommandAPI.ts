import { BaseAPI } from "./BaseAPI";
import { TodoController } from "./controllers/TodoController";

/**
 * A subclass of BaseAPI that handles commands for the TodoController.
 */
export class CommandAPI extends BaseAPI {
  // The TodoController instance
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
    // Assign the TodoController object from the channel to the instance attribute
    this.TodoController = this.channel.objects.TodoController;
  }
}

// Export a new CommandAPI instance as API
export const API = new CommandAPI();
