import { todos } from "../stores/todoStore";
import { For } from "solid-js";
import Todo from "./Todo";
import { VStack } from "../../styled-system/jsx";

export default function TodoList() {
  return (
    <VStack
      flex={"1"}
      alignItems={"stretch"}
      gap={1}
      background={"tertiary"}
      paddingX={10}
      paddingY={6}
      overflowY={"auto"}
      scrollbarGutter={"stable both-edges"}
    >
      <For each={todos.ids} children={Todo} />
    </VStack>
  );
}
