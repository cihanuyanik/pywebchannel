import "./TodoInput.scss";
import { API } from "../api/CommandAPI";
import { v4 as uuidv4 } from "uuid";
import AddCircle from "./icons/AddCircle";
import { messageBox } from "./Dialogs/MessageBox";

export default function TodoInput() {
  let input: HTMLInputElement;

  const onAdd = async () => {
    if (!input.value.trim()) return;

    try {
      const response = await API.TodoController.add({
        id: uuidv4(),
        text: input.value.trim(),
        completed: false,
        isSelected: false
      });

      if (response.error) throw new Error(response.error);
    } catch (e) {
      messageBox.error(`${e}`);
    }

    input.value = "";
  };

  async function onKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") await onAdd();
  }

  return (
    <div class="todoInput-container">
      <input class="todoInput-input" ref={input!} onKeyUp={onKeyUp} />
      <button onClick={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
}
