import {
  component$,
  useContext,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import "./style.scss";
import Header from "../Header";
import TodoInput from "~/components/TodoInput";
import TodoList from "~/components/TodoList";
import { API } from "~/api/CommandAPI";
import { SignalConnManager } from "~/api/utils/Utils";
import { createTodoStore, TodoContext } from "~/stores/todoStore";

export default component$(() => {
  // Create Todo Store
  useContextProvider(TodoContext, useStore(createTodoStore()));
  const todos = useContext(TodoContext);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    try {
      await API.connect();
      await todos.setupConnections();
    } catch (error) {
      console.log(error);
    }

    cleanup(() => {
      // Clean up --> Disconnect signals
      SignalConnManager.disconnectAll();
      API.disconnect().then();
    });
  });

  return (
    <div class={"app-container"}>
      <Header />
      <TodoInput />
      <TodoList />
    </div>
  );
});
