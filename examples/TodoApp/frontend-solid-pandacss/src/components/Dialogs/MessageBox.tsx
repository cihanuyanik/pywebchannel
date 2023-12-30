import { createStore } from "solid-js/store";
import { createMutator } from "../../stores/utils";
import { css } from "../../../panda-css/css";
import { FlexColumn } from "../../../panda-css/jsx";
import {
  Content,
  Controls,
  Dialog,
  DialogResult,
  DialogType,
  Title,
} from "./Dialog";
import { Button } from "../Button";
import { Tick } from "../icons/Tick";
import { Cross } from "../icons/Cross";

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
      <FlexColumn background={"secondary"}>
        <Title title={messageBox.title} />
        <Content type={messageBox.type} message={messageBox.message} />
        <Controls>
          {messageBox.type === "question" ? (
            <>
              <Button
                class={css({
                  flex: "1 1 auto",
                  rounded: "md",
                  height: "7",
                  color: "green.500",
                  gap: "1",
                })}
                onClick={async () => messageBox.close(DialogResult.Yes)}
              >
                Yes <Tick />
              </Button>
              <Button
                class={css({
                  flex: "1 1 auto",
                  rounded: "md",
                  height: "7",
                  color: "red.500",
                  gap: "1",
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
                rounded: "md",
                height: "7",
                color: "green.500",
                gap: "1",
              })}
              onClick={async () => messageBox.close(DialogResult.OK)}
            >
              OK <Tick />
            </Button>
          )}
        </Controls>
      </FlexColumn>
    </Dialog>
  );
};
