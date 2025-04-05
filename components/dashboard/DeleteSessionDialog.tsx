'use client';

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
import { toast } from "sonner";

interface DeleteSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onDeleteSuccess: () => void;
}

export function DeleteSessionDialog({
  isOpen,
  onClose,
  sessionId,
  onDeleteSuccess,
}: DeleteSessionDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      
      toast.success('Session deleted successfully');
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this study session? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 