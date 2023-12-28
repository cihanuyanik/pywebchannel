import { onCleanup, onMount } from "solid-js";
import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import { SignalConnManager } from "../api/utils/Utils";
import Header from "./Header";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { BusyDialog, busyDialog } from "./Dialogs/BusyDialog";
import { MessageBox, messageBox } from "./Dialogs/MessageBox";
import { css } from "../../styled-system/css";
import { flex, grid } from "../../styled-system/patterns";

export default function App() {
  onMount(async () => {
    try {
      busyDialog.show("Connecting to server...");
      await API.connect();
      await todos.setupConnections();
      busyDialog.close();
    } catch (error) {
      busyDialog.close();
      messageBox.error(`${error}`);
    }
  });

  onCleanup(() => {
    // Clean up --> Disconnect signals
    SignalConnManager.disconnectAll();
    API.disconnect().then();
  });

  return (
    <div
      class={css({
        height: "screen",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        position: "relative",
        color: "text",
      })}
    >
      <Header />
      <TodoInput />
      <TodoList />
      <BusyDialog />
      <MessageBox />
    </div>
  );
}
