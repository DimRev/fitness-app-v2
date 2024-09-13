import { type DialogProps } from "@radix-ui/react-dialog";
import { H3 } from "~/features/shared/components/Typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/features/shared/components/ui/dialog";
import { cn } from "~/lib/utils";
import useLayoutStore from "../hooks/useLayoutStore";

type Props = DialogProps & {
  errorMessage: string;
  errorCode: string;
};

function ErrorDialog({ errorMessage, errorCode, ...dialogProps }: Props) {
  const { isDarkMode } = useLayoutStore();

  return (
    <Dialog {...dialogProps}>
      <DialogContent
        className={cn(
          isDarkMode && "dark",
          "text-foreground",
          "bg-destructive text-destructive-foreground",
        )}
      >
        <DialogTitle>Error!</DialogTitle>
        <H3>{errorMessage}</H3>
        <DialogDescription>Error ({errorCode})</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default ErrorDialog;
