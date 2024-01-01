import { createStore } from "solid-js/store";
import { createMutator } from "~/stores/utils";
import { createRoot } from "solid-js";

export type BusyDialogStore = {
  dialogRef: HTMLDialogElement | null;
  message: string;
  isOpen: boolean;
  show: (message: string) => void;
  close: () => void;
};

function createBusyDialogStore() {
  const [busyDialog, setBusyDialog] = createStore<BusyDialogStore>({
    dialogRef: null,
    message: "",
    isOpen: false,
    show: (message: string) => {
      mutate((state) => {
        state.message = message;
        state.dialogRef?.showModal();
      });
    },

    close: () => {
      mutate((state) => {
        state.message = "";
        state.dialogRef?.close();
      });
    },
  });

  const mutate = createMutator(setBusyDialog);

  return { busyDialog, mutate };
}

export const { busyDialog, mutate } = createRoot(createBusyDialogStore);
