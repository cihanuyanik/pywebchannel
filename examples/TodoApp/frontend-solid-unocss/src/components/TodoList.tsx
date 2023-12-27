import { todos } from "../stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";

export default function TodoList() {
  return (
    <div
      class="bg-tertiary p-x-40px p-y-25px
            grid auto-rows content-start gap-1
            overflow-y-auto sb-stable-both"
    >
      <For each={todos.ids} children={Todo} />
    </div>
  );
}
