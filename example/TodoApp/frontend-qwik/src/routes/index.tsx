import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import "../global.css";
import App from "~/components/App";

export default component$(() => {
  return <App />;
});

export const head: DocumentHead = {
  title: "Todo App",
  meta: [
    {
      name: "description",
      content: "Todo Application with Qwik",
    },
  ],
};
