import type { QRL } from "@builder.io/qwik";
import { $, component$, createContextId, useContext } from "@builder.io/qwik";
import ErrorImage from "~/media/assets/error.png?jsx";
import WarningImage from "~/media/assets/warning.png?jsx";
import InfoImage from "~/media/assets/info.png?jsx";
import SuccessImage from "~/media/assets/success.png?jsx";
import QuestionImage from "~/media/assets/question.png?jsx";
import Tick from "~/media/icons/Tick";
import {
  button,
  controls,
  crossIcon,
  dialog,
  imageMessage,
  messageBoxContent,
  tickIcon,
  title
} from "~/components/Dialogs/Dialog.css";
import Cross from "~/media/icons/Cross";

// Enum type for the MessageBox dialog result
export enum DialogResult {
  OK = "OK",
  Cancel = "Cancel",
  Yes = "Yes",
  No = "No"
}

export type MessageBoxStore = {
  dialogRef: HTMLDialogElement | null;
  type: "error" | "warning" | "info" | "success" | "question";
  title: string;
  message: string;
  dialogResult: DialogResult;
  error: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  warning: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  info: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  success: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  question: QRL<(this: MessageBoxStore, message: string, title?: string) => Promise<DialogResult>>;
  close: QRL<(this: MessageBoxStore) => void>;
};

export const createMessageBoxStore = (): MessageBoxStore => {
  return {
    dialogRef: null,
    type: "error",
    title: "",
    message: "",
    dialogResult: DialogResult.OK,

    error: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "error";
      this.message = message;
      this.title = title === "" ? "Error" : title;
      this.dialogRef?.showModal();
    }),

    warning: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "warning";
      this.message = message;
      this.title = title === "" ? "Warning" : title;
      this.dialogRef?.showModal();
    }),

    info: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "info";
      this.message = message;
      this.title = title === "" ? "Information" : title;
      this.dialogRef?.showModal();
    }),

    success: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "success";
      this.message = message;
      this.title = title === "" ? "Successful" : title;
      this.dialogRef?.showModal();
    }),

    question: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "question";
      this.message = message;
      this.title = title === "" ? "???" : title;
      this.dialogRef?.showModal();
      return new Promise<DialogResult>((resolve) => {
        const closeHandler = () => {
          resolve(this.dialogResult);
          this.dialogRef?.removeEventListener("close", closeHandler);
        };

        this.dialogRef?.addEventListener("close", closeHandler);
      });
    }),

    close: $(function (this: MessageBoxStore) {
      this.dialogRef?.close();
    })
  };
};

export const MessageBoxContext = createContextId<MessageBoxStore>("MessageBox");

const iconMap = {
  error: <ErrorImage />,
  warning: <WarningImage />,
  info: <InfoImage />,
  success: <SuccessImage />,
  question: <QuestionImage />
};

export const MessageBox = component$(() => {
  const messageBox = useContext(MessageBoxContext);

  return (
    <dialog ref={(el) => (messageBox.dialogRef = el)} class={dialog}>
      <div class={messageBoxContent}>
        <div class={title}>
          <p>{messageBox.title}</p>
        </div>
        <div class={imageMessage}>
          {iconMap[messageBox.type]}
          <div>{messageBox.message}</div>
        </div>
        <div class={controls}>
          {messageBox.type === "question" ? (
            <>
              <button
                class={button}
                onClick$={async () => {
                  messageBox.dialogResult = DialogResult.Yes;
                  await messageBox.close();
                }}
              >
                Yes <Tick class={tickIcon} />
              </button>
              <button
                class={button}
                onClick$={async () => {
                  messageBox.dialogResult = DialogResult.No;
                  await messageBox.close();
                }}
              >
                No <Cross class={crossIcon} />
              </button>
            </>
          ) : (
            <button
              class={button}
              onClick$={async () => {
                messageBox.dialogResult = DialogResult.OK;
                await messageBox.close();
              }}
            >
              OK <Tick class={tickIcon} />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
});
