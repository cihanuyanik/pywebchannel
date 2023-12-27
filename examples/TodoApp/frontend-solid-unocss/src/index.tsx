/* @refresh reload */
import { render } from "solid-js/web";
// import "./css/style.css";
import "./global.css";
import "virtual:uno.css";

import App from "./components/App";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

render(() => <App />, root!);
