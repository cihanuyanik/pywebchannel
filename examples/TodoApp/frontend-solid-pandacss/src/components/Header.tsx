import { todos } from "../stores/todoStore";
import { createMemo } from "solid-js";
import { HStack } from "../../styled-system/jsx";

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
    <HStack
      height={"100px"}
      justify={"center"}
      bgLinGrad={"tb secondaryDarker secondaryLighter"}
      borderBottomColor={"secondaryDarker"}
      borderBottomStyle={"solid"}
      borderBottomWidth={"thick"}
      fontWeight={"bolder"}
      fontSize={"xx-large"}
    >
      Todo App (#: {completedTodoCount()}/{todos.todoCount})
    </HStack>
  );
}
