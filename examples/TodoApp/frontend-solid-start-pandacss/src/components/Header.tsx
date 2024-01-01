import { todos } from "~/stores/todoStore";
import { createMemo } from "solid-js";
import { Center } from "../../panda-css/jsx";

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
    <Center
      height={"100px"}
      bgLinGrad={"tb secondaryDarker secondaryLighter"}
      zIndex={0}
      fontWeight={"bolder"}
      fontSize={"xx-large"}
      boxShadow={"2px 5px 10px token(colors.primaryDarker)"}
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </Center>
  );
}
