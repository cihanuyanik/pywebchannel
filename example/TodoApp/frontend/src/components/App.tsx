import { For, onCleanup, onMount } from "solid-js";
import { todos } from "../stores/todoStore";
import { API } from "../api/CommandAPI";
import { v4 as uuidv4 } from "uuid";
import { SignalConnManager } from "../api/utils/Utils";
import Header from "./Header";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";

export default function App() {
  onMount(async () => {
    try {
      await API.connect();
      await todos.setupConnections();
    } catch (error) {
      console.log(error);
    }
  });

  onCleanup(() => {
    // Clean up --> Disconnect signals
    SignalConnManager.disconnectAll();
    API.disconnect().then();
  });

  return (
    <div class="app-container">
      <Header />
      <TodoInput />
      <TodoList />
    </div>
  );
}
