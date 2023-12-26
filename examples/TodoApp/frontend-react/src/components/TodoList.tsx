import { useTodos } from "../stores/todoStore.ts";
import { Todo } from "./Todo.tsx";

export function TodoList() {
  const ids = useTodos((state) => state.ids);
  return (
    <div className={"todo-list"}>
      {ids.map((id) => (
        <Todo key={id} id={id} />
      ))}
    </div>
  );
}
