"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LanguageDialogProps {
  isOpen: boolean;
  onSave: (language: string) => Promise<void>;
  onClose: () => void;
}

export function LanguageDialog({
  isOpen,
  onSave,
  onClose,
}: LanguageDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
  };

  const handleGetStarted = async () => {
    if (!selectedLanguage) return;

    try {
      setIsSubmitting(true);
      await onSave(selectedLanguage);
      onClose();
    } catch (error) {
      console.error("Error saving language preference:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[400px] w-[90%] mx-auto rounded-md [&_.close-button]:hidden"
        onEscapeKeyDown={onClose}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Choose Your Language</DialogTitle>
          <DialogDescription>
            Select your preferred language for studying.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            variant={selectedLanguage === "english" ? "default" : "outline"}
            onClick={() => handleLanguageSelect("english")}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            <span>🇺🇸</span>
            English
          </Button>
          <Button
            variant={selectedLanguage === "spanish" ? "default" : "outline"}
            onClick={() => handleLanguageSelect("spanish")}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2"
          >
            <span>🇪🇸</span>
            Español
          </Button>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGetStarted}
            disabled={!selectedLanguage || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <>Get started</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
