////////////////////////////////////////////////////
// Auto generated file
// Generation time: 2023-12-14 16:04:13
////////////////////////////////////////////////////

import type { Signal } from "../models/Signal";
import type { Response } from "../models/Response";

// Todo interface
export interface Todo {
  // Properties
  id: string;
  text: string;
  completed: boolean;
  isSelected: boolean;
}

// TodoController interface
export interface TodoController {
  // Properties
  todoCount: number;

  // Signals
  testSignal: Signal<
    (arg1: number, arg2: string, arg3: number[][], arg4: Todo[]) => void
  >;
  testSignal2: Signal<
    (arg1: string, arg2: number, arg3: number[][], arg4: Todo[]) => void
  >;
  onAdd: Signal<(new_todo: Todo) => void>;
  onRemove: Signal<(removed_todo: Todo) => void>;
  todoUpdated: Signal<(todo: Todo) => void>;
  todoCountChanged: Signal<(todoCount: number) => void>;

  // Slots
  testAction(): Promise<Response>;

  getTodos(): Promise<Response>;

  add(new_todo: Todo): Promise<Response>;

  remove(todo_id: string): Promise<Response>;

  update(todo: Todo): Promise<Response>;
}
