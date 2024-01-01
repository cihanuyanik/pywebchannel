import { createStore } from "solid-js/store";
import { createMutator } from "~/stores/utils";
import { createRoot } from "solid-js";

export type DialogType = "error" | "warning" | "info" | "success" | "question";

export enum DialogResult {
  OK = "OK",
  Yes = "Yes",
  No = "No",
}

export type MessageBoxStore = {
  dialogRef: HTMLDialogElement | null;
  type: DialogType;
  title: string;
  message: string;
  dialogResult: DialogResult;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  question: (message: string, title?: string) => Promise<DialogResult>;
  close: (result?: DialogResult) => void;
};

function createMessageBoxStore() {
  const [messageBox, setMessageBox] = createStore<MessageBoxStore>({
    dialogRef: null,
    type: "error",
    title: "",
    message: "",
    dialogResult: DialogResult.OK,

    error: (message: string, title: string = "") => {
      mutate((state) => {
        state.type = "error";
        state.message = message;
        state.title = title === "" ? "Error" : title;
        state.dialogRef?.showModal();
      });
    },

    warning: (message: string, title: string = "") => {
      mutate((state) => {
        state.type = "warning";
        state.message = message;
        state.title = title === "" ? "Warning" : title;
        state.dialogRef?.showModal();
      });
    },

    info: (message: string, title: string = "") => {
      mutate((state) => {
        state.type = "info";
        state.message = message;
        state.title = title === "" ? "Information" : title;
        state.dialogRef?.showModal();
      });
    },

    success: (message: string, title: string = "") => {
      mutate((state) => {
        state.type = "success";
        state.message = message;
        state.title = title === "" ? "Successful" : title;
        state.dialogRef?.showModal();
      });
    },

    question: (message: string, title: string = "") => {
      return new Promise<DialogResult>((resolve) => {
        const closeHandler = () => {
          mutate((state) => {
            state.dialogRef?.removeEventListener("close", closeHandler);
            resolve(state.dialogResult);
          });
        };

        mutate((state) => {
          state.type = "question";
          state.message = message;
          state.title = title === "" ? "???" : title;
          state.dialogRef?.showModal();
          state.dialogRef?.addEventListener("close", closeHandler);
        });
      });
    },

    close: (result?: DialogResult) => {
      mutate((state) => {
        state.message = "";
        state.dialogResult = result ?? DialogResult.OK;
        state.dialogRef?.close();
      });
    },
  });

  const mutate = createMutator(setMessageBox);

  return { messageBox, mutate };
}

export const { messageBox, mutate } = createRoot(createMessageBoxStore);
