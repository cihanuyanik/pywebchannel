import { deepSignal } from "deepsignal/react";
import { Todo } from "../api/controllers/TodoController.ts";
import { batch } from "@preact/signals-react";
import { SignalConnManager } from "../api/utils/Utils.ts";
import { API } from "../api/CommandAPI.ts";

export const todos = deepSignal({
  ids: [] as string[],
  entities: {} as Record<string, Todo>,
  selectedIds: [] as string[],
  todoCount: 0,
  completedCount: 0,
  add: (todo: Todo) => {
    batch(() => {
      todos.ids = [...todos.ids, todo.id];
      todos.entities[todo.id] = todo;
    });
  },

  update: (todo: Todo) => {
    todos.entities[todo.id] = todo;
  },

  remove: (todo: Todo) => {
    batch(() => {
      delete todos.entities[todo.id];
      todos.ids = todos.ids.filter((id) => id !== todo.id);
    });
  },

  async setupConnections() {
    // console.log(API.TodoController);

    // Use the SignalConnManager to auto-connect the store to the TodoController
    SignalConnManager.connect(
      API.TodoController.todoCountChanged,
      (count: number) => {
        todos.todoCount = count;
      },
    );

    // Use the SignalConnManager to connect the newTodoAdded event to a callback that adds a new Todo item to the store
    SignalConnManager.connect(API.TodoController.onAdd, (todo: Todo) => {
      this.add(todo);
    });

    // Use the SignalConnManager to connect the todoRemoved event to a callback that removes a Todo item from the store by its id
    SignalConnManager.connect(API.TodoController.onRemove, (todo: Todo) => {
      this.remove(todo);
    });

    // Use the SignalConnManager to connect the todoUpdated event to a callback that updates a Todo item in the store
    SignalConnManager.connect(API.TodoController.todoUpdated, (todo: Todo) => {
      this.update(todo);
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
      batch(() => {
        todos.ids = response.data.ids;
        todos.todoCount = response.data.todoCount;
        todos.entities = response.data.entities;
        todos.selectedIds = response.data.selectedIds;
      });
    } else {
      console.log(response);
    }
  },
});
