import { component$, useContext } from "@builder.io/qwik";
import Todo from "~/components/Todo";
import { TodoContext } from "~/stores/todoStore";
import { todoList } from "~/components/TodoList.css";

export default component$(() => {
  const todos = useContext(TodoContext);

  return (
    <div class={todoList}>
      {todos.ids.map((id) => (
        <Todo key={id} id={id} />
      ))}
    </div>
  );
});
