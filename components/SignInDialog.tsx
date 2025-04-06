"use client";

import { SignIn } from "@clerk/nextjs";

interface SignInDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInDialog({ isOpen }: SignInDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <SignIn redirectUrl="/" routing="hash" />
    </div>
  );
}
