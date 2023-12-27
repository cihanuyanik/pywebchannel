import { createStore } from "solid-js/store";
import BusyDialogGif from "/src/assets/busydialog.gif";
import { createMutator } from "../../stores/utils";
import { Dialog } from "./Dialog";

export type BusyDialogStore = {
  dialogRef: HTMLDialogElement | null;
  message: string;
  isOpen: boolean;
  show: (message: string) => void;
  close: () => void;
};

export const [busyDialog, setBusyDialog] = createStore<BusyDialogStore>({
  dialogRef: null,
  message: "",
  isOpen: false,
  show: (message: string) => {
    mutator((state) => {
      state.message = message;
      state.dialogRef?.showModal();
    });
  },

  close: () => {
    mutator((state) => {
      state.message = "";
      state.dialogRef?.close();
    });
  },
});

const mutator = createMutator(setBusyDialog);

export const BusyDialog = () => {
  return (
    <Dialog ref={(el) => setBusyDialog("dialogRef", el)}>
      <div
        grid={"row content-center justify-center"}
        text-center
        bg={"primary"}
        class="opacity-70"
      >
        <img
          src={BusyDialogGif}
          alt={"Busy Dialog gif"}
        />
        <p>{busyDialog.message}</p>
      </div>
    </Dialog>
  );
};
