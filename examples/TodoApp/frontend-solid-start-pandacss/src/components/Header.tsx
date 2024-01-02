import { todos } from "~/stores/todoStore";
import { createMemo } from "solid-js";
import { Box, Center, Float } from "../../panda-css/jsx";
import * as url from "url";
import { css } from "../../panda-css/css";

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
    <Box
      height={"150px"}
      // bgLinGrad={"tb secondaryDarker secondaryLighter"}
      // boxShadow={"2px 5px 10px token(colors.primaryDarker)"}
      zIndex={0}
      fontWeight={"bolder"}
      fontSize={"xx-large"}
      position={"relative"}
    >
      <img
        src="/src/assets/bg-header.png"
        alt={"bg_header.png"}
        class={css({
          width: "full",
          height: "full",
          backgroundColor: "tertiary",
        })}
      />

      <Float
        placement={"top-center"}
        width={"max-content"}
        height={"40px"}
        top={"50px !important"}
      >
        Todo App (#: {completedTodoCount()}/{todos.todoCount})
      </Float>
    </Box>
  );
}
