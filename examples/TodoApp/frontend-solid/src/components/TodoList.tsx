import "./TodoList.scss";
import { todos } from "../stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";

export default function TodoList() {
  return (
    <div class="todoList">
      <For each={todos.ids} children={Todo} />
    </div>
  );
}
