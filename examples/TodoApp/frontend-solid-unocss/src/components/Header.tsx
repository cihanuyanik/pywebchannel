import { todos } from "../stores/todoStore";
import { createMemo } from "solid-js";

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
    <div
      h={"100px"}
      grid={"rows items-center justify-center"}
      bg={"gradient-to-b_secondaryDarker_secondaryLighter"}
      font="bold size-7"
      border-b="3px solid secondaryDarker"
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </div>
  );
}
