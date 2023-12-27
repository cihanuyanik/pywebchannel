import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";
import { messageBox } from "./Dialogs/MessageBox";

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
      h={"30px"}
      w={"30px"}
      mr={"10px"}
      hover={"[&_svg]:color-tertiary"}
      onClick={onCompletedChanged}
    >
      {todos.entities[props.id].completed ? (
        <CheckMarkDone
          h={"30px"}
          w={"30px"}
          color={"green"}
        />
      ) : (
        <Circle />
      )}
    </div>
  );
}

function Text(props: { id: string }) {
  return (
    <span class={todos.entities[props.id].completed ? "line-through" : ""}>
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
    <button onClick={onClick}>
      <DeleteOutline />
    </button>
  );
}

export default function Todo(id: string) {
  return (
    <div
      h={"50px"}
      p={"x-2"}
      grid={"cols-[auto_1fr_auto] items-center gap-1"}
      rounded={"5px"}
      shadow={"primaryDarker [0_2px_2px]"}
      bg={
        "gradient-to-l_secondaryDarker_secondaryLighter " +
        "hover:(gradient-to-r_secondaryDarker_secondaryLighter)"
      }
      scale={"100 hover:(102)"}
      transition={"transform"}
    >
      <Status id={id} />
      <Text id={id} />
      <DeleteButton id={id} />
    </div>
  );
}
