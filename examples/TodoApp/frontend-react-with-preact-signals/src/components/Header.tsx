import { todos } from "../stores/todoStore.ts";
import { computed } from "@preact/signals-react";

export function Header() {
  const completedTodoCount = computed(() => {
    let count = 0;
    for (const id of todos.ids) {
      if (todos.entities[id].completed) count++;
    }
    return count;
  });

  return (
    <div className={"header"}>
      Todo App (#: {completedTodoCount}/{todos.$todoCount})
    </div>
  );
}
