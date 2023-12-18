import type { QRL } from "@builder.io/qwik";
import { createContextId } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";
import type { Todo } from "~/api/controllers/TodoController";
import { SignalConnManager } from "~/api/utils/Utils";
import { API } from "~/api/CommandAPI";

export type TodoStore = {
  ids: string[];
  entities: Record<string, Todo>;
  selectedIds: string[];
  todoCount: number;
  completedCount: number;
  add: QRL<(this: TodoStore, todo: Todo) => void>;
  update: QRL<(this: TodoStore, todo: Todo) => void>;
  remove: QRL<(this: TodoStore, todo: Todo) => void>;
  setupConnections: QRL<(this: TodoStore) => Promise<void>>;
};

export const TodoContext = createContextId<TodoStore>("TodoContext");
export const createTodoStore = (): TodoStore => {
  return {
    ids: [] as string[],
    entities: {} as Record<string, Todo>,
    selectedIds: [] as string[],
    todoCount: 0,
    completedCount: 0,
    add: $(function (this: TodoStore, todo: Todo) {
      this.ids.push(todo.id);
      this.entities[todo.id] = todo;
      this.todoCount = this.ids.length;
    }),

    update: $(function (this: TodoStore, todo: Todo) {
      this.entities[todo.id] = todo;
    }),

    remove: $(function (this: TodoStore, todo: Todo) {
      this.ids = this.ids.filter((id) => id !== todo.id);
      delete this.entities[todo.id];
      this.todoCount = this.ids.length;
    }),

    setupConnections: $(async function (this: TodoStore) {
      // Use the SignalConnManager to auto-connect the store to the TodoController
      SignalConnManager.connect(
        API.TodoController.todoCountChanged,
        (count: number) => {
          this.todoCount = count;
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
      SignalConnManager.connect(
        API.TodoController.todoUpdated,
        (todo: Todo) => {
          this.update(todo);
        },
      );

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
        this.ids = response.data.ids;
        this.todoCount = response.data.todoCount;
        this.entities = response.data.entities;
        this.selectedIds = response.data.selectedIds;
      } else {
        console.log(response);
      }
    }),
  };
};
