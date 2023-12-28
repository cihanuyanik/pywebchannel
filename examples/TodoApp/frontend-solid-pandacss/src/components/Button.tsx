import { JSX } from "solid-js";
import { css } from "../../styled-system/css";

export function Button(props: {
  onClick: () => void;
  children: JSX.Element | JSX.Element[];
  class?: string;
  style?: string;
}) {
  return (
    <button
      class={
        css({
          border: "none",
          outline: "none",
          padding: "0px",
          margin: "0px",
          cursor: "pointer",
          height: "36px",
          width: "36px",
          borderRadius: "50%",
          color: "text",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          transition: "background",
          background: {
            base: "primary",
            _hover: "primaryLighter",
          },
          "& svg": {
            height: "auto",
            width: "auto",
          },
        }) +
        " " +
        (props.class || "")
      }
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
