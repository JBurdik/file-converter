import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: ReactNode;
}

interface DialogDescriptionProps {
  children: ReactNode;
}

interface DialogActionsProps {
  children: ReactNode;
}

interface DialogButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

function DialogRoot({ open, onOpenChange, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDialog.Root>
  );
}

function DialogTrigger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <BaseDialog.Trigger
      className={
        className ??
        "flex h-10 items-center justify-center rounded-[10px] border border-gray-200 bg-gray-50 px-4 text-base font-medium text-text-primary select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-blue active:scale-[0.98] transition-all duration-200"
      }
    >
      {children}
    </BaseDialog.Trigger>
  );
}

function DialogContent({ children, className }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black/25 backdrop-blur-[2px] transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <BaseDialog.Popup
        className={`fixed top-1/2 left-1/2 w-full max-w-md max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 ${className ?? ""}`}
      >
        <BaseDialog.Close className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-text-hint hover:bg-gray-100 hover:text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-blue transition-colors duration-200">
          <X size={18} />
        </BaseDialog.Close>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

function DialogTitle({ children }: DialogTitleProps) {
  return (
    <BaseDialog.Title className="pr-8 text-xl font-semibold text-text-primary">
      {children}
    </BaseDialog.Title>
  );
}

function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <BaseDialog.Description className="mt-2 text-base text-text-secondary leading-relaxed">
      {children}
    </BaseDialog.Description>
  );
}

function DialogActions({ children }: DialogActionsProps) {
  return <div className="mt-6 flex justify-end gap-3">{children}</div>;
}

function DialogButton({ children, variant = "secondary", onClick }: DialogButtonProps) {
  const baseStyles =
    "flex h-11 items-center justify-center rounded-[10px] px-5 text-base font-medium select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-blue active:scale-[0.98] transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-b from-brand-blue-light to-brand-blue text-white shadow-[0_2px_8px_rgba(45,136,255,0.3)] hover:shadow-[0_4px_12px_rgba(45,136,255,0.4)] hover:brightness-105",
    secondary:
      "border border-border-light bg-white text-text-primary hover:bg-gray-50",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function DialogClose({ children, variant = "secondary" }: Omit<DialogButtonProps, "onClick">) {
  const baseStyles =
    "flex h-11 items-center justify-center rounded-[10px] px-5 text-base font-medium select-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-blue active:scale-[0.98] transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-b from-brand-blue-light to-brand-blue text-white shadow-[0_2px_8px_rgba(45,136,255,0.3)] hover:shadow-[0_4px_12px_rgba(45,136,255,0.4)] hover:brightness-105",
    secondary:
      "border border-border-light bg-white text-text-primary hover:bg-gray-50",
  };

  return (
    <BaseDialog.Close className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </BaseDialog.Close>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Button: DialogButton,
  Close: DialogClose,
};
