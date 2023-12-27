import { createStore } from "solid-js/store";
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
  No = "No",
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
  },
});

const mutate = createMutator(setMessageBox);

export const MessageBox = () => {
  const iconMap = {
    error: ErrorImage,
    warning: WarningImage,
    info: InfoImage,
    success: SuccessImage,
    question: QuestionImage,
  };

  return (
    <dialog
      ref={(el) => setMessageBox("dialogRef", el)}
      class="absolute top-50% left-50% z-9999 translate-x-[-50%] translate-y-[-50%]
      w-400px outline-none border-none rounded-10px
      color-text bg-transparent [&::backdrop]:(bg-[rgba(0,0,0,0.5)])
      shadow-primaryDarker shadow-[0_0_10px_8px]
      font-size-18px font-bold
      "
    >
      <div class="grid grid-flow-row bg-secondary">
        <div
          class="h-36px grid grid-flow-row place-content-center
        border-b-3px border-b-solid border-b-secondaryDarker"
        >
          <p>{messageBox.title}</p>
        </div>
        <div
          class="mx-1 px-1 py-3
                border-b-3px border-b-solid border-b-secondaryDarker
                bg-tertiary
                grid grid-flow-col items-center
                font-size-15px
                [&_img]:(h-70px w-70px mr-10px)"
        >
          <img src={iconMap[messageBox.type]} alt={messageBox.type} />
          <div>{messageBox.message}</div>
        </div>
        <div class="flex flex-row items-center content-center gap-1 p-1">
          {messageBox.type === "question" ? (
            <>
              <button
                class="flex-1 rounded-1 h-26px
                flex flex-row place-items-center place-content-center gap-1
                font-bold font-size-15px"
                onClick={async () => messageBox.close(DialogResult.Yes)}
              >
                Yes <Tick class="h-20px w-20px color-green" />
              </button>
              <button
                class="flex-1 rounded-1 h-26px
                flex flex-row place-items-center place-content-center gap-1
                font-bold font-size-15px"
                onClick={async () => messageBox.close(DialogResult.No)}
              >
                No <Cross class="color-red" />
              </button>
            </>
          ) : (
            <button
              class="flex-1 rounded-1 h-26px
                flex flex-row place-items-center place-content-center gap-1
                font-bold font-size-15px"
              onClick={async () => messageBox.close(DialogResult.OK)}
            >
              OK <Tick class="h-20px w-20px color-green" />
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
};
