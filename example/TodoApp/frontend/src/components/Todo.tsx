import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";

export default function Todo(id: string) {
  const onCompletedChanged = async () => {
    const response = await API.TodoController.update({
      ...todos.entities[id],
      completed: !todos.entities[id].completed,
    });

    if (response.error) {
      console.log(response.error);
    }
  };
  return (
    <div class="todo">
      <div class="todo-status" onClick={onCompletedChanged}>
        {todos.entities[id].completed ? (
          <CheckMarkDone style="color: green; height: 30px; width: 30px;" />
        ) : (
          <Circle />
        )}
      </div>

      <span
        style={{
          // @ts-ignore
          "text-decoration": todos.entities[id].completed
            ? "line-through"
            : "none",
        }}
      >
        {todos.entities[id].text}
      </span>

      {todos.entities[id].isSelected ? "selected" : null}
      <button
        onClick={async () => {
          const response = await API.TodoController.remove(id);
          if (response.error) {
            console.log(response.error);
          }
        }}
      >
        <DeleteOutline />
      </button>
    </div>
  );
}
