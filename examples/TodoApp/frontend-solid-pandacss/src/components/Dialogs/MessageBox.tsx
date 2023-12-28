import { createStore } from "solid-js/store";
import { Tick } from "../icons/Tick";
import { Cross } from "../icons/Cross";
import { createMutator } from "../../stores/utils";
import {
  Content,
  Controls,
  Dialog,
  DialogResult,
  DialogType,
  Title,
} from "./Dialog";
import { css } from "../../../styled-system/css";
import { Button } from "../Button";

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
  return (
    <Dialog ref={(el) => setMessageBox("dialogRef", el)}>
      <div
        class={css({
          display: "grid",
          gridAutoFlow: "row",
          background: "secondary",
        })}
      >
        <Title title={messageBox.title} />
        <Content type={messageBox.type} message={messageBox.message} />
        <Controls>
          {messageBox.type === "question" ? (
            <>
              <Button
                class={css({
                  flex: "1 1 auto",
                  rounded: "5px",
                  height: "26px",
                  color: "green.500",
                  gap: "5px",
                })}
                onClick={async () => messageBox.close(DialogResult.Yes)}
              >
                Yes <Tick />
              </Button>
              <Button
                class={css({
                  flex: "1 1 auto",
                  rounded: "5px",
                  height: "26px",
                  color: "red.500",
                  gap: "5px",
                })}
                onClick={async () => messageBox.close(DialogResult.No)}
              >
                No <Cross />
              </Button>
            </>
          ) : (
            <Button
              class={css({
                flex: "1 1 auto",
                rounded: "5px",
                height: "26px",
                color: "green.500",
                gap: "5px",
              })}
              onClick={async () => messageBox.close(DialogResult.OK)}
            >
              OK <Tick />
            </Button>
          )}
        </Controls>
      </div>
    </Dialog>
  );
};
