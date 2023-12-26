import { createStore, produce } from "solid-js/store";
import "./Dialog.scss";
import BusyDialogGif from "/src/assets/busydialog.gif";
import { createMutator } from "../../stores/utils";

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
  }
});

const mutator = createMutator(setBusyDialog);

export const BusyDialog = () => {
  return (
    <dialog ref={(el) => setBusyDialog("dialogRef", el)} class="dialog">
      <div class="busyDialogContent">
        <img src={BusyDialogGif} alt={"Busy Dialog gif"} />
        <p>{busyDialog.message}</p>
      </div>
    </dialog>
  );
};
