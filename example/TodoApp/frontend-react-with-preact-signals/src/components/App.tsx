import { Header } from "./Header.tsx";
import { TodoInput } from "./TodoInput.tsx";
import { TodoList } from "./TodoList.tsx";
import { useEffect } from "react";
import { SignalConnManager } from "../api/utils/Utils.ts";
import { API } from "../api/CommandAPI.ts";

import { todos } from "../stores/todoStore.ts";

function App() {
  useEffect(() => {
    async function connectToAPI() {
      try {
        await API.connect();
        await todos.setupConnections();
        // useTodos.getState().setupConnections();
      } catch (error) {
        console.log(error);
      }
    }

    connectToAPI().then();

    return () => {
      // Clean up --> Disconnect signals
      SignalConnManager.disconnectAll();
      API.disconnect().then();
    };
  }, []);

  return (
    <div className={"app-container"}>
      <Header />
      <TodoInput />
      <TodoList />
    </div>
  );
}

export default App;
