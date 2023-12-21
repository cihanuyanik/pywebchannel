import {
  component$,
  useContext,
  useContextProvider,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import Header from "./Header";
import TodoInput from "~/components/TodoInput";
import TodoList from "~/components/TodoList";
import { API } from "~/api/CommandAPI";
import { SignalConnManager } from "~/api/utils/Utils";
import { createTodoStore, TodoContext } from "~/stores/todoStore";
import {
  BusyDialog,
  BusyDialogContext,
  createBusyDialogStore,
} from "~/components/Dialogs/BusyDialog";
import {
  createMessageBoxStore,
  MessageBox,
  MessageBoxContext,
} from "~/components/Dialogs/MessageBox";
import { themeClass } from "~/style/theme.css";
import { appContainer } from "~/components/App.css";

export default component$(() => {
  // Create stores and provide them to the context
  useContextProvider(TodoContext, useStore(createTodoStore()));
  useContextProvider(BusyDialogContext, useStore(createBusyDialogStore()));
  useContextProvider(MessageBoxContext, useStore(createMessageBoxStore()));

  const todos = useContext(TodoContext);
  const busyDialog = useContext(BusyDialogContext);
  const messageBox = useContext(MessageBoxContext);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    try {
      await busyDialog.show("Connecting to server...");
      await API.connect();
      await todos.setupConnections();
      await busyDialog.close();
    } catch (error) {
      await busyDialog.close();
      await messageBox.error(`${error}`);
    }

    cleanup(() => {
      // Clean up --> Disconnect signals
      SignalConnManager.disconnectAll();
      API.disconnect().then();
    });
  });

  return (
    <div class={`${themeClass} ${appContainer}`}>
      <Header />
      <TodoInput />
      <TodoList />
      <BusyDialog />
      <MessageBox />
    </div>
  );
});
