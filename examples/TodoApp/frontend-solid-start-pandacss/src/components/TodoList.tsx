import { todos } from "~/stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";
import { Scrollable } from "../../panda-css/jsx";

export default function TodoList() {
  return (
    <Scrollable
      direction={"vertical"}
      hideScrollbar={true}
      background={"tertiary"}
      flex={"1"}
      paddingX={10}
      paddingY={6}
    >
      <For each={todos.ids} children={Todo} />
    </Scrollable>
  );
}
