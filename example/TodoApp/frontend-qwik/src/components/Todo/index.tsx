import { $, component$, useContext } from "@builder.io/qwik";
import "./style.scss";
import CheckMarkDone from "~/components/icons/CheckMarkDone";
import Circle from "~/components/icons/Circle";
import DeleteOutline from "~/components/icons/DeleteOutline";
import { TodoContext } from "~/stores/todoStore";
import { API } from "~/api/CommandAPI";

type Props = {
  id: string;
};

const Status = component$(({ id }: Props) => {
  const todos = useContext(TodoContext);

  const onCompletedChanged = $(async () => {
    const response = await API.TodoController.update({
      ...todos.entities[id],
      completed: !todos.entities[id].completed,
    });

    if (response.error) {
      console.log(response.error);
    }
  });

  return (
    <div class="status" onClick$={onCompletedChanged}>
      {todos.entities[id].completed ? (
        <CheckMarkDone
          style={{ color: "green", height: "30px", width: "30px" }}
        />
      ) : (
        <Circle />
      )}
    </div>
  );
});

const Text = component$(({ id }: Props) => {
  const todos = useContext(TodoContext);
  return (
    <span
      style={{
        textDecoration: todos.entities[id].completed ? "line-through" : "none",
      }}
    >
      {todos.entities[id].text}
    </span>
  );
});

const DeleteButton = component$(({ id }: Props) => {
  const onRemove = $(async () => {
    const response = await API.TodoController.remove(id);

    if (response.error) {
      console.log(response.error);
    }
  });

  return (
    <button onClick$={onRemove}>
      <DeleteOutline />
    </button>
  );
});
export default component$(({ id }: Props) => {
  return (
    <div class="todo">
      <Status id={id} />
      <Text id={id} />
      <DeleteButton id={id} />
    </div>
  );
});
