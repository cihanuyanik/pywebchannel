import { createStore, produce } from "solid-js/store";
import "./Dialog.scss";
import ErrorImage from "/src/assets/error.png";
import WarningImage from "/src/assets/warning.png";
import InfoImage from "/src/assets/info.png";
import SuccessImage from "/src/assets/success.png";
import QuestionImage from "/src/assets/question.png";
import { Tick } from "../icons/Tick";
import { Cross } from "../icons/Cross";
import { createMutator } from "../../stores/utils";

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
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  question: (message: string, title?: string) => Promise<DialogResult>;
  close: (result?: DialogResult) => void;
};

export const [messageBox, setMessageBox] = createStore<MessageBoxStore>({
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
  }
});

const mutate = createMutator(setMessageBox);

export const MessageBox = () => {
  const iconMap = {
    error: ErrorImage,
    warning: WarningImage,
    info: InfoImage,
    success: SuccessImage,
    question: QuestionImage
  };

  return (
    <dialog ref={(el) => setMessageBox("dialogRef", el)} class="dialog">
      <div class="messageBoxContent">
        <div class="title">
          <p>{messageBox.title}</p>
        </div>
        <div class="imageMessage">
          <img src={iconMap[messageBox.type]} alt={messageBox.type} />
          <div>{messageBox.message}</div>
        </div>
        <div class="controls">
          {messageBox.type === "question" ? (
            <>
              <button class="button" onClick={async () => messageBox.close(DialogResult.Yes)}>
                Yes <Tick class="tickIcon" />
              </button>
              <button class="button" onClick={async () => messageBox.close(DialogResult.No)}>
                No <Cross class="crossIcon" />
              </button>
            </>
          ) : (
            <button class="button" onClick={async () => messageBox.close(DialogResult.OK)}>
              OK <Tick class="tickIcon" />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};
