import { component$, useComputed$, useContext } from "@builder.io/qwik";
import { TodoContext } from "~/stores/todoStore";
import { header } from "~/components/Header.css";

export default component$(() => {
  const todos = useContext(TodoContext);

  const completedTodoCount = useComputed$(() => {
    let count = 0;
    for (const id of todos.ids) {
      if (todos.entities[id].completed) count++;
    }
    return count;
  });

  return (
    <div class={header}>
      <p>Todo App</p>
      <p>
        (#: {completedTodoCount}/{todos.todoCount})
      </p>
    </div>
  );
});
