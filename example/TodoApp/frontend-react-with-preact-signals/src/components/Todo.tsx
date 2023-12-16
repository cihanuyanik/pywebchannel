import CheckMarkDone from "./icons/CheckMarkDone.tsx";
import Circle from "./icons/Circle.tsx";
import DeleteOutline from "./icons/DeleteOutline.tsx";
import React, { useEffect } from "react";
import { API } from "../api/CommandAPI.ts";
import { todos } from "../stores/todoStore.ts";

function Status({ id }: { id: string }) {
  const todo = todos.entities[id];

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
    <div className="todo-status" onClick={onCompletedChanged}>
      {todo.completed ? (
        <CheckMarkDone
          style={{ color: "green", height: "30px", width: "30px" }}
        />
      ) : (
        <Circle />
      )}
    </div>
  );
}

function Text({ id }: { id: string }) {
  const todo = todos.entities[id];
  return (
    <span
      style={{
        textDecoration: todo.completed ? "line-through" : "none",
      }}
    >
      {todo.text}
    </span>
  );
}

// Remove component
function Remove({ id }: { id: string }) {
  const onRemove = async () => {
    const response = await API.TodoController.remove(id);

    if (response.error) {
      console.log(response.error);
    }
  };

  return (
    <button onClick={onRemove}>
      <DeleteOutline />
    </button>
  );
}

export function TodoComponent({ id }: { id: string }) {
  return (
    <div className="todo">
      <Status id={id} />
      <Text id={id} />
      <Remove id={id} />
    </div>
  );
}

// Memorize the component
export const Todo = React.memo(TodoComponent);
