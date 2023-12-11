import { API } from "../api/CommandAPI";
import { v4 as uuidv4 } from "uuid";
import AddCircle from "./icons/AddCircle";

export default function TodoInput(props: {}) {
  let input: HTMLInputElement;

  const onAdd = async () => {
    if (!input.value.trim()) return;

    const response = await API.TodoController.add({
      id: uuidv4(),
      text: input.value.trim(),
      completed: false,
      isSelected: false,
    });

    if (response.error) {
      console.log(response.error);
    }

    input.value = "";
  };

  async function onKeyUp(e: KeyboardEvent) {
    if (e.key === "Enter") await onAdd();
  }

  return (
    <div class="todo-input">
      <input ref={input!} onKeyUp={onKeyUp} />
      <button onClick={onAdd}>
        <AddCircle />
      </button>
      {/*<span>Todo Count: {todos.todoCount}</span>*/}
    </div>
  );
}
