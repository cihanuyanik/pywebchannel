import { todos } from "../stores/todoStore";

import { For } from "solid-js";
import Todo from "./Todo";

type Props = {};
export default function TodoList(pros: Props) {
  return (
    <div class="todo-list">
      <For each={todos.ids} children={Todo} />
    </div>
  );
}
