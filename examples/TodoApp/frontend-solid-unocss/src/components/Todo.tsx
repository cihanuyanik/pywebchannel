import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import DeleteOutline from "./icons/DeleteOutline";
import Circle from "./icons/Circle";
import CheckMarkDone from "./icons/CheckMarkDone";
import { messageBox } from "./Dialogs/MessageBox";

export default function Todo(id: string) {
  const onCompletedChanged = async () => {
    try {
      const response = await API.TodoController.update({
        ...todos.entities[id],
        completed: !todos.entities[id].completed,
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
      class="h-50px p-x-5px
            grid grid-cols-[auto_1fr_auto] items-center gap-1
            rounded-5px
            shadow-primaryDarker shadow-[0_2px_2px]
            bg-gradient-to-l from-secondaryDarker to-secondaryLighter
            hover:(bg-gradient-to-r from-secondaryDarker to-secondaryLighter)
            scale-100 hover:scale-102
            transition-transform"
    >
      <div
        class="h-30px w-30px mr-10px hover:[&_svg]:color-tertiaryLighter"
        onClick={onCompletedChanged}
      >
        {todos.entities[id].completed ? (
          <CheckMarkDone class="h-30px w-30px color-green" />
        ) : (
          <Circle />
        )}
      </div>

      <span class={todos.entities[id].completed ? "line-through" : ""}>
        {todos.entities[id].text}
      </span>

      {todos.entities[id].isSelected ? "selected" : null}
      <button
        onClick={async () => {
          try {
            const dialogResult = await messageBox.question(
              "Are you sure you want to delete this todo?",
            );
            if (dialogResult === "No") return;

            const response = await API.TodoController.remove(id);
            if (response.error) throw new Error(response.error);
          } catch (e) {
            messageBox.error(`${e}`);
          }
        }}
      >
        <DeleteOutline />
      </button>
    </div>
  );
}
