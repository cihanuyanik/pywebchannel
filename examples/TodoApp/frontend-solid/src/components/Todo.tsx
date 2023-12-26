import "./Todo.scss";
import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";
import { messageBox } from "./Dialogs/MessageBox";

export default function Todo(id: string) {
  const onCompletedChanged = async () => {
    try {
      const response = await API.TodoController.update({
        ...todos.entities[id],
        completed: !todos.entities[id].completed
      });

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (e) {
      messageBox.error(`${e}`);
    }
  };

  return (
    <div class="todo">
      <div class="status" onClick={onCompletedChanged}>
        {todos.entities[id].completed ? <CheckMarkDone style="color: green; height: 30px; width: 30px;" /> : <Circle />}
      </div>

      <span
        style={{
          // @ts-ignore
          "text-decoration": todos.entities[id].completed ? "line-through" : "none"
        }}
      >
        {todos.entities[id].text}
      </span>

      {todos.entities[id].isSelected ? "selected" : null}
      <button
        onClick={async () => {
          try {
            const dialogResult = await messageBox.question("Are you sure you want to delete this todo?");
            if (dialogResult === "No") return;

            const response = await API.TodoController.remove(id);
            if (response.error) throw new Error(response.error);
          } catch (e) {
            messageBox.error(`${e}`);
          }
        }}
      >
        <DeleteOutline />
      </button>
    </div>
  );
}
