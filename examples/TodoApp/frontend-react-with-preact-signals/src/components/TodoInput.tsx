import React, { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import AddCircle from "./icons/AddCircle.tsx";
import { API } from "../api/CommandAPI.ts";

export function TodoInput() {
  const input = useRef<HTMLInputElement>(null);

  async function onAdd() {
    if (!input.current?.value.trim()) return;

    const response = await API.TodoController.add({
      id: uuidv4(),
      text: input.current.value.trim(),
      completed: false,
      isSelected: false,
    });

    if (response.error) {
      console.log(response.error);
    }

    input.current.value = "";
  }

  async function onKeyUp(e: React.KeyboardEvent) {
    if (e.key === "Enter") await onAdd();
  }

  return (
    <div className={"todo-input"}>
      <input ref={input} onKeyUp={onKeyUp} />
      <button onClick={onAdd}>
        <AddCircle />
      </button>
    </div>
  );
}
