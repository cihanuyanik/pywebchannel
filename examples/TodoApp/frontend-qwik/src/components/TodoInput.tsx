import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import AddCircle from "~/media/icons/AddCircle";
import { API } from "~/api/CommandAPI";
import { v4 as uuidv4 } from "uuid";
import { MessageBoxContext } from "~/components/Dialogs/MessageBox";
import { container, input } from "~/components/TodoInput.css";

export default component$(() => {
  const inputRef = useSignal<HTMLInputElement>();
  const messageBox = useContext(MessageBoxContext);

  const onAdd = $(async () => {
    const input = inputRef.value;
    if (!input?.value.trim()) return;

    try {
      const response = await API.TodoController.add({
        id: uuidv4(),
        text: input.value.trim(),
        completed: false,
        isSelected: false
      });

      if (response.error) throw new Error(response.error);
    } catch (e) {
      await messageBox.error(`${e}`);
    }

    input.value = "";
  });

  const onKeyUp = $(async (e: KeyboardEvent) => {
    if (e.key === "Enter") await onAdd();
  });

  return (
    <div class={container}>
      <input class={input} ref={inputRef} onKeyUp$={onKeyUp} />
      <button onClick$={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
});
