import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";
import { messageBox } from "./Dialogs/MessageBox";
import { Button } from "./Button";
import { css } from "../../panda-css/css";
import { Box, FlexRow } from "../../panda-css/jsx";

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

  const svgStyle = css({
    height: "30px",
    width: "30px",
    transition: "color 150ms ease-in-out",

    _hover: {
      color: "tertiary",
    },
  });

  return (
    <Box height={30} width={30} mr={2} onClick={onCompletedChanged}>
      {todos.entities[props.id].completed ? (
        <CheckMarkDone class={svgStyle} h={"30px"} w={"30px"} color={"green"} />
      ) : (
        <Circle class={svgStyle} />
      )}
    </Box>
  );
}

function Text(props: { id: string }) {
  return (
    <Box
      flex={1}
      textDecoration={
        todos.entities[props.id].completed ? "line-through" : "none"
      }
    >
      {todos.entities[props.id].text}
    </Box>
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
    <FlexRow
      marginBottom={1}
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
    </FlexRow>
  );
}
