import {
  $,
  component$,
  createContextId,
  type QRL,
  useContext,
} from "@builder.io/qwik";
import "./style.scss";

export type BusyDialogStore = {
  dialogRef: HTMLDialogElement | null;
  message: string;
  show: QRL<(this: BusyDialogStore, message: string) => void>;
  close: QRL<(this: BusyDialogStore) => void>;
};

export const createBusyDialogStore = () => {
  return {
    dialogRef: null,
    message: "",
    isOpen: false,
    show: $(function (this: BusyDialogStore, message: string) {
      this.message = message;
      this.dialogRef?.showModal();
    }),
    close: $(function (this: BusyDialogStore) {
      this.message = "";
      this.dialogRef?.close();
    }),
  };
};

export const BusyDialogContext = createContextId<BusyDialogStore>("BusyDialog");

export const BusyDialog = component$(() => {
  const busyDialog = useContext(BusyDialogContext);

  return (
    <dialog ref={(el) => (busyDialog.dialogRef = el)} class={"dialog"}>
      <div class={"busy-dialog-content"}>
        {/* eslint-disable-next-line qwik/jsx-img */}
        <img src="/assets/busydialog.gif" alt={"Busy Dialog gif"} />
        <p>{busyDialog.message}</p>
      </div>
    </dialog>
  );
});
