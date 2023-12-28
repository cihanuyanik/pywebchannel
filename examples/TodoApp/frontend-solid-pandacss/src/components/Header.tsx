import { todos } from "../stores/todoStore";
import { createMemo } from "solid-js";
import { css } from "../../styled-system/css";

export default function Header() {
  const completedTodoCount = createMemo(() => {
    let completedCount = 0;
    for (const id of todos.ids) {
      if (todos.entities[id].completed) {
        completedCount++;
      }
    }
    return completedCount;
  });

  return (
    <div
      class={css({
        height: "100px",
        display: "grid",
        gridAutoFlow: "row",
        placeItems: "center",
        bgGradient: "to-b",
        gradientFrom: "secondaryDarker",
        gradientTo: "secondaryLighter",

        fontWeight: "bolder",
        fontSize: "xx-large",
        borderBottom: "4px solid token(colors.secondaryDarker)",
      })}
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </div>
  );
}
