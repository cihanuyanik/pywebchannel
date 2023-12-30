import { onCleanup, onMount } from "solid-js";
import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import { SignalConnManager } from "../api/utils/Utils";
import Header from "./Header";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { BusyDialog, busyDialog } from "./Dialogs/BusyDialog";
import { MessageBox, messageBox } from "./Dialogs/MessageBox";
import { FlexColumn } from "../../panda-css/jsx";

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
    <FlexColumn align={"stretch"} height={"screen"} color={"text"}>
      <Header />
      <TodoInput />
      <TodoList />
      <BusyDialog />
      <MessageBox />
    </FlexColumn>
  );
}
