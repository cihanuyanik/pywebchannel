import { todos } from "../stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";
import { css } from "../../styled-system/css";

export default function TodoList() {
  return (
    <div
      class={css({
        background: "tertiary",
        paddingX: "40px",
        paddingY: "25px",
        display: "grid",
        gridAutoFlow: "row",
        gap: "4px",
        alignContent: "start",
        overflowY: "auto",
        scrollbarGutter: "stable both-edges",
      })}
    >
      <For each={todos.ids} children={Todo} />
    </div>
  );
}
