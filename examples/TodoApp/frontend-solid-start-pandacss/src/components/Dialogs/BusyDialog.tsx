import BusyDialogGif from "/src/assets/busydialog.gif";
import { Dialog } from "./Dialog";
import { FlexColumn } from "../../../panda-css/jsx";
import { busyDialog, mutate } from "~/stores/busyDialogStore";

export default function BusyDialog() {
  return (
    <Dialog ref={(el) => mutate((state) => (state.dialogRef = el))}>
      <FlexColumn background={"primary"} opacity={0.7}>
        <img src={BusyDialogGif} alt={"Busy Dialog gif"} />
        <p>{busyDialog.message}</p>
      </FlexColumn>
    </Dialog>
  );
}
