import { API } from "../api/CommandAPI";
import { v4 as uuidv4 } from "uuid";
import AddCircle from "./icons/AddCircle";
import { messageBox } from "./Dialogs/MessageBox";
import { css } from "../../styled-system/css";
import { Button } from "./Button";

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
      class={css({
        position: "absolute",
        top: "70px",
        zIndex: 3,
        width: "full",
        height: "50px",
        paddingX: "10",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "1",
        alignItems: "center",
      })}
    >
      <input
        ref={input!}
        onKeyUp={onKeyUp}
        class={css({
          color: "primary",
          background: "tertiaryLighter",
          fontWeight: "bolder",
          textAlign: "center",
          padding: "1",
          roundedTop: "xl",
          roundedBottom: "md",
          border: "none",
          outline: "none",
          transition: "shadow",
          boxShadow: {
            base: "2px 5px 10px token(colors.primaryDarker)",
            _focus: "0 0 10px 8px token(colors.primaryLighter)",
          },
        })}
      />
      <Button onClick={onAdd}>
        <AddCircle />
      </Button>
    </div>
  );
}
