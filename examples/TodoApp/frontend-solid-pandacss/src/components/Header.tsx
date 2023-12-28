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
        // @ts-ignore
        bgLinGrad: "tb secondaryDarker secondaryLighter",
        fontWeight: "bolder",
        fontSize: "xx-large",
        borderBottomColor: "secondaryDarker",
        borderBottomStyle: "solid",
        borderBottomWidth: "thick",
      })}
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </div>
  );
}
