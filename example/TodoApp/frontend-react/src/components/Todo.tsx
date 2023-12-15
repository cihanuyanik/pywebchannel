import { useTodos } from "../stores/todoStore.ts";
import CheckMarkDone from "./icons/CheckMarkDone.tsx";
import Circle from "./icons/Circle.tsx";
import DeleteOutline from "./icons/DeleteOutline.tsx";
import React from "react";
import { API } from "../api/CommandAPI.ts";

export function TodoComponent({ id }: { id: string }) {
  const todo = useTodos((state) => state.entities[id]);

  const onCompletedChanged = async () => {
    const response = await API.TodoController.update({
      ...todo,
      completed: !todo.completed,
    });

    if (response.error) {
      console.log(response.error);
    }
  };

  return (
    <div className="todo">
      <div className="todo-status" onClick={onCompletedChanged}>
        {todo.completed ? (
          <CheckMarkDone
            style={{ color: "green", height: "30px", width: "30px" }}
          />
        ) : (
          <Circle />
        )}
      </div>

      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
        }}
      >
        {todo.text}
      </span>

      {todo.isSelected ? "selected" : null}
      <button
        onClick={async () => {
          const response = await API.TodoController.remove(id);
          if (response.error) {
            console.log(response.error);
          }
        }}
      >
        <DeleteOutline />
      </button>
    </div>
  );
}

// Memorize the component
export const Todo = React.memo(TodoComponent);
