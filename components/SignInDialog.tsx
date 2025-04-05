"use client";

import { SignIn } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInDialog({ isOpen, onClose }: SignInDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0" showCloseButton={true}>
        <SignIn redirectUrl="/" />
      </DialogContent>
    </Dialog>
  );
} 