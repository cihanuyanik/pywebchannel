import { create } from "zustand";
import { produce } from "immer";
import { SignalConnManager } from "../api/utils/Utils.ts";
import { API } from "../api/CommandAPI.ts";
import { Todo } from "../api/controllers/TodoController.ts";

export type TodoStore = {
  ids: string[];
  entities: Record<string, Todo>;
  selectedIds: string[];
  todoCount: number;
  completedCount: number;
  add: (todo: Todo) => void;
  remove: (todo: Todo) => void;
  update: (todo: Todo) => void;
  setupConnections(): void;
};

export const useTodos = create<TodoStore>((set) => ({
  ids: [] as string[],
  entities: {} as Record<string, Todo>,
  selectedIds: [] as string[],
  todoCount: 0,
  get completedCount() {
    const state = useTodos.getState();
    let count = 0;
    for (const id of state.ids) {
      if (state.entities[id].completed) count++;
    }
    return count;
  },
  add: (todo: Todo) => {
    set(
      produce((state: TodoStore) => {
        state.ids.push(todo.id);
        state.entities[todo.id] = todo;
      }),
    );
  },

  remove: (todo: Todo) => {
    set(
      produce((state: TodoStore) => {
        state.ids = state.ids.filter((id) => id !== todo.id);
        delete state.entities[todo.id];
      }),
    );
  },

  update: (todo: Todo) => {
    set(
      produce((state: TodoStore) => {
        state.entities[todo.id] = todo;
      }),
    );
  },

  async setupConnections() {
    // console.log(API.TodoController);

    // Use the SignalConnManager to auto-connect the store to the TodoController
    SignalConnManager.connect(
      API.TodoController.todoCountChanged,
      (count: number) => {
        useTodos.setState(
          produce((state) => {
            state.todoCount = count;
          }),
        );
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
      const data = response.data;
      useTodos.setState(
        produce((state) => {
          state.ids = data.ids;
          state.todoCount = data.todoCount;
          state.entities = data.entities;
          state.selectedIds = data.selectedIds;
        }),
      );
    } else {
      console.log(response);
    }
  },
}));
