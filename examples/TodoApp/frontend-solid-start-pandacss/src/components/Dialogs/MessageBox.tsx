import { css } from "../../../panda-css/css";
import { FlexColumn } from "../../../panda-css/jsx";
import { Content, Controls, Dialog, Title } from "./Dialog";
import { Button } from "../Button";
import { Tick } from "../icons/Tick";
import { Cross } from "../icons/Cross";
import { DialogResult, messageBox, mutate } from "~/stores/messageBoxStore";

export default function MessageBox() {
  return (
    <Dialog ref={(el) => mutate((state) => (state.dialogRef = el))}>
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
}
