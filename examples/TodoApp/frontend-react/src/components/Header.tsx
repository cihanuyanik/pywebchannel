import { useTodos } from "../stores/todoStore.ts";

export function Header() {
  const todoCount = useTodos((state) => state.todoCount);
  const completedTodoCount = useTodos((state) => {
    let count = 0;
    for (const id of state.ids) {
      if (state.entities[id].completed) count++;
    }
    return count;
  });

  return (
    <div className={"header"}>
      Todo App (#: {completedTodoCount}/{todoCount})
    </div>
  );
}
