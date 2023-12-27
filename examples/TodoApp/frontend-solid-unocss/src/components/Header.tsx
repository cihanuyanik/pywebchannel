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
      class="h-100px w-full
             bg-gradient-to-b from-secondaryDarker to-secondaryLighter
             grid place-items-center"
      // @ts-ignore
      font="bold size-7"
      border-b="3px solid secondaryDarker"
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </div>
  );
}
