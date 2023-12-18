import { component$, useComputed$, useContext } from "@builder.io/qwik";
import "./style.scss";
import { TodoContext } from "~/stores/todoStore";

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
    <div class={"header"}>
      Todo App (#: {completedTodoCount}/{todos.todoCount})
    </div>
  );
});
