import { createStore, produce } from "solid-js/store";
import { createAdaptor, SelectableAdaptor } from "./EntityAdaptor";
import { Todo } from "../api/controllers/TodoController";
import { SignalConnManager } from "../api/utils/Utils";
import { API } from "../api/CommandAPI";
import { createMutator } from "./utils";

/**
 * This module defines a store and a mutator for managing Todo items with ids and selection states.
 */

// Create an adaptor object for Todo items using the createAdaptor function
const adaptor = createAdaptor(() => setTodos, true) as SelectableAdaptor<Todo>;

// Create a store for Todo items using the createStore function
export const [todos, setTodos] = createStore({
  // Initialize the store with the initial state from the adaptor
  ...adaptor.getInitialState(),
  // Add a todoCount property to the store
  todoCount: 0,
  // Add a setupConnections method to the store that sets up the Signal connections and retrieves the initial data
  setupConnections: async () => {
    // console.log(API.TodoController);

    // Use the SignalConnManager to auto-connect the store to the TodoController
    SignalConnManager.autoConnect(todos, setTodos, API.TodoController);

    // Use the SignalConnManager to connect the newTodoAdded event to a callback that adds a new Todo item to the store
    SignalConnManager.connect(API.TodoController.onAdd, (todo: Todo) => {
      todos.add(todo);
    });

    // Use the SignalConnManager to connect the todoRemoved event to a callback that removes a Todo item from the store by its id
    SignalConnManager.connect(API.TodoController.onRemove, (todo: Todo) => {
      todos.remove(todo.id);
    });

    // Use the SignalConnManager to connect the todoUpdated event to a callback that updates a Todo item in the store
    SignalConnManager.connect(API.TodoController.todoUpdated, (todo: Todo) => {
      todos.update(todo);
    });

    // Use the SignalConnManager to connect the testSignal event to a callback that logs some arguments
    SignalConnManager.connect(
      API.TodoController.testSignal,
      (arg1: number, arg2: string, arg3: number[][], arg4: Todo[]) => {
        console.log("Test Signal received");
        console.log(arg1, arg2);
        console.log(arg3);
        console.log(arg4);
      },
    );

    // Call the testAction method from the TodoController
    await API.TodoController.testAction();

    // Retrieve the initial state from the TodoController
    const response = await API.TodoController.getTodos();
    // Mutate the state based on the retrieved data
    if (!response.error && response.data) {
      const data = response.data;
      mutate((state) => {
        state.ids = data.ids;
        state.todoCount = data.todoCount;
        state.entities = data.entities;
        state.selectedIds = data.selectedIds;
      });
    } else {
      console.log(response);
    }
  },

  // Add a toggleTodo method to the store that toggles the completed state of a Todo item by its id
  toggleTodo: (id: string) => {
    // Use the setTodos function and the produce function to modify the state
    setTodos(
      produce((state) => {
        // Get the Todo item from the state by its id
        const todo = state.entities[id];
        // Toggle the completed property of the Todo item
        todo.completed = !todo.completed;
      }),
    );
  },
});

// Create a mutator function for the store using the createMutator function
const mutate = createMutator(setTodos);
