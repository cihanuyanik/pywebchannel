import { component$, useContext } from "@builder.io/qwik";
import "./style.scss";
import Todo from "~/components/Todo";
import { TodoContext } from "~/stores/todoStore";

export default component$(() => {
  const todos = useContext(TodoContext);

  return (
    <div class={"todo-list"}>
      {todos.ids.map((id) => (
        <Todo key={id} id={id} />
      ))}
    </div>
  );
});
