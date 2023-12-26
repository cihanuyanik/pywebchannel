import { todos } from "../stores/todoStore";
import { createMemo } from "solid-js";
import "./Header.scss";

export default function Header() {
  const completedTodoCount = createMemo(() => {
    let completedCount = 0;
    for (const id of todos.ids) {
      if (todos.entities[id].completed) {
        completedCount++;
      }
    }
    return completedCount;
  });
  return (
    <div class="header">
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </div>
  );
}
