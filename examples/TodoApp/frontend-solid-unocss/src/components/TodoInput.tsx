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
      grid={"cols-[1fr_auto] gap-1 items-center"}
      position={"absolute top-70px z-3"}
      w={"full"}
      h={"50px"}
      p="x-40px"
    >
      <input
        ref={input!}
        onKeyUp={onKeyUp}
        color={"primary"}
        bg={"tertiaryLighter"}
        font={"bold center"}
        text-center
        p={"5px"}
        rounded={"tl-3 tr-3 br-1 bl-1"}
        shadow={
          "primaryDarker [2px_5px_10px] focus:(primaryLighter [0_0_10px_8px])"
        }
        transition={"shadow"}
      />
      <button onClick={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
}
