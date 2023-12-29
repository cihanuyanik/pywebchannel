import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";
import { messageBox } from "./Dialogs/MessageBox";
import { Button } from "./Button";
import { css } from "../../styled-system/css";
import { HStack } from "../../styled-system/jsx";

function Status(props: { id: string }) {
  const onCompletedChanged = async () => {
    try {
      const response = await API.TodoController.update({
        ...todos.entities[props.id],
        completed: !todos.entities[props.id].completed,
      });

      if (response.error) {
        throw new Error(response.error);
      }
    } catch (e) {
      messageBox.error(`${e}`);
    }
  };

  return (
    <div
      class={css({
        height: "30px",
        width: "30px",
        marginRight: "2",
        "& svg": {
          base: {
            height: "30px",
            width: "30px",
          },
          _hover: {
            color: "tertiary",
          },
        },
      })}
      onClick={onCompletedChanged}
    >
      {todos.entities[props.id].completed ? (
        <CheckMarkDone h={"30px"} w={"30px"} color={"green"} />
      ) : (
        <Circle />
      )}
    </div>
  );
}

function Text(props: { id: string }) {
  return (
    <span
      class={css({
        flex: "1",
        textDecoration: todos.entities[props.id].completed
          ? "line-through"
          : "none",
      })}
    >
      {todos.entities[props.id].text}
    </span>
  );
}

function DeleteButton(props: { id: string }) {
  async function onClick() {
    try {
      const dialogResult = await messageBox.question(
        "Are you sure you want to delete this todo?",
      );
      if (dialogResult === "No") return;

      const response = await API.TodoController.remove(props.id);
      if (response.error) throw new Error(response.error);
    } catch (e) {
      messageBox.error(`${e}`);
    }
  }

  return (
    <Button onClick={onClick}>
      <DeleteOutline />
    </Button>
  );
}

export default function Todo(id: string) {
  return (
    <HStack
      minHeight={50}
      paddingX={2}
      gap={1}
      borderRadius={"lg"}
      boxShadow={"0 2px 2px token(colors.primaryDarker)"}
      bgLinGrad={{
        base: "tr secondaryDarker secondaryLighter",
        _hover: "tl secondaryDarker secondaryLighter",
      }}
      scale={{
        base: "1",
        _hover: "1.02",
      }}
      transition={"scale 150ms ease-in-out"}
    >
      <Status id={id} />
      <Text id={id} />
      <DeleteButton id={id} />
    </HStack>
  );
}
