"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfirmDeleteTestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testInfo?: { startedAt: string; user?: { firstName: string; lastName: string; email: string } };
}

export function ConfirmDeleteTestDialog({ isOpen, onClose, onConfirm, testInfo }: ConfirmDeleteTestDialogProps) {
  const [input, setInput] = useState("");

  let description: JSX.Element | string = "Are you sure you want to delete the test? Type DELETE to confirm.";
  if (testInfo) {
    const startedDate = new Date(testInfo.startedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    description = (
      <>
        Are you sure you want to delete the test started on <b>{startedDate}</b>
        {testInfo.user && (
          <>
            {" for "}
            <b>{testInfo.user.firstName} {testInfo.user.lastName}</b> (<b>{testInfo.user.email}</b>)
          </>
        )}
        ?<br />
        <span className="block mt-2">Type <b>DELETE</b> to confirm.</span>
      </>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => { setInput(""); onClose(); }}>
      <DialogContent className="sm:max-w-[400px] w-[90%] mx-auto rounded-md">
        <DialogHeader>
          <DialogTitle>Delete Test?</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type DELETE to confirm"
          className="w-full border rounded px-3 py-2 mt-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
        />
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => { setInput(""); onClose(); }} className="w-full">Cancel</Button>
          <Button variant="destructive" onClick={() => { setInput(""); onConfirm(); }} className="w-full" disabled={input !== "DELETE"}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 