import { Title } from "solid-start";
import { isServer } from "solid-js/web";
import { onCleanup, onMount } from "solid-js";

import { FlexColumn } from "../../panda-css/jsx";
import Header from "~/components/Header";
import TodoInput from "~/components/TodoInput";
import TodoList from "~/components/TodoList";
import BusyDialog from "~/components/Dialogs/BusyDialog";
import { busyDialog } from "~/stores/busyDialogStore";
import { API } from "~/api/CommandAPI";
import { SignalConnManager } from "~/api/utils/Utils";

import MessageBox from "~/components/Dialogs/MessageBox";
import { todos } from "~/stores/todoStore";
import { messageBox } from "~/stores/messageBoxStore";

export default function Home() {
  onMount(async () => {
    if (isServer) return;
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
    if (isServer) return;
    SignalConnManager.disconnectAll();
    API.disconnect().then();
  });

  return (
    <main>
      <Title>Todo App</Title>
      <FlexColumn align={"stretch"} height={"screen"} color={"text"}>
        <Header />
        <TodoInput />
        <TodoList />
        <BusyDialog />
        <MessageBox />
      </FlexColumn>
    </main>
  );
}
