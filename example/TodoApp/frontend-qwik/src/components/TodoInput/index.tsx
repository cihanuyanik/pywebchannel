import { $, component$, useSignal } from "@builder.io/qwik";
import "./style.scss";
import AddCircle from "~/components/icons/AddCircle";
import { API } from "~/api/CommandAPI";
import { v4 as uuidv4 } from "uuid";

export default component$(() => {
  const inputRef = useSignal<HTMLInputElement>();

  const onAdd = $(async () => {
    const input = inputRef.value;
    if (!input?.value.trim()) return;

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
  });

  const onKeyUp = $(async (e: KeyboardEvent) => {
    if (e.key === "Enter") await onAdd();
  });

  return (
    <div class={"todo-input"}>
      <input ref={inputRef} onKeyUp$={onKeyUp} />
      <button onClick$={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
});
