import { todos } from "../stores/todoStore";
import { createComputed, createMemo } from "solid-js";

type Props = {};
export default function Header(props: Props) {
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
