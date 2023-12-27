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
        isSelected: false,
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
    <div
      // @ts-ignore
      grid="~ cols-[1fr_auto] gap-1 items-center"
      p="x-40px"
      class="absolute top-70px z-3 w-full h-50px"
    >
      <input
        ref={input!}
        onKeyUp={onKeyUp}
        class="color-primary bg-tertiaryLighter
              font-bold text-center p-5px
              rounded-tl-10px rounded-tr-10px rounded-br-4px rounded-bl-4px
              shadow-primaryDarker shadow-[2px_5px_10px]
              focus:(shadow-primaryLighter shadow-[0_0_10px_8px])
              transition-shadow
              "
      />
      <button onClick={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
}
