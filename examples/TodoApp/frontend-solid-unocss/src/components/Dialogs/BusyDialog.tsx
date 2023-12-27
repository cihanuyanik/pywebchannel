import { createStore } from "solid-js/store";
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
  },
});

const mutator = createMutator(setBusyDialog);

export const BusyDialog = () => {
  return (
    <dialog
      ref={(el) => setBusyDialog("dialogRef", el)}
      class="absolute top-50% left-50% z-9999 translate-x-[-50%] translate-y-[-50%]
      w-400px outline-none border-none rounded-10px
      color-text bg-transparent [&::backdrop]:(bg-[rgba(0,0,0,0.5)])
      shadow-primaryDarker shadow-[0_0_10px_8px]
      font-size-18px font-bold
      "
    >
      <div
        class="grid grid-flow-row place-content-center text-center
      bg-primary opacity-70"
      >
        <img src={BusyDialogGif} alt={"Busy Dialog gif"} />
        <p>{busyDialog.message}</p>
      </div>
    </dialog>
  );
};
