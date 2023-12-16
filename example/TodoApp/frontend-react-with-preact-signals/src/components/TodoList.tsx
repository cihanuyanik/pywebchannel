import { Todo } from "./Todo.tsx";
import { todos } from "../stores/todoStore.ts";
import React from "react";

export function TodoList() {
  return (
    <div className={"todo-list"}>
      {todos.ids.map((id) => (
        <Todo key={id} id={id} />
      ))}
    </div>
  );
}
