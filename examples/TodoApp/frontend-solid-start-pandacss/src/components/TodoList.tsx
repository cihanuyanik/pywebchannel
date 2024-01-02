import { todos } from "~/stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";
import { Scrollable } from "../../panda-css/jsx";
import { TransitionGroup } from "solid-transition-group";

export default function TodoList() {
  return (
    <Scrollable
      direction={"vertical"}
      hideScrollbar={true}
      background={"tertiary"}
      flex={"1"}
      paddingX={10}
      paddingY={2}
    >
      <TransitionGroup name={"todo-item"}>
        <For each={todos.ids} children={Todo} />
      </TransitionGroup>
    </Scrollable>
  );
}
