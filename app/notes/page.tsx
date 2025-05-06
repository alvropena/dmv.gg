"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function NotesPage() {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // This would typically come from your data source
  const notes: Note[] = [
    {
      id: "1",
      title: "Meeting Notes",
      content: "Discuss project timeline and deliverables...",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Ideas",
      content: "New feature ideas for the next sprint...",
      createdAt: new Date(),
    },
    // Add more sample notes as needed
  ];

  return (
    <div className="w-full py-8 bg-[#F1F1EF] min-h-screen">
      <div className="px-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-transparent"
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold">All Notes</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          View and manage all your notes in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note) => (
            <Card 
              key={note.id} 
              className="hover:shadow-lg transition-shadow bg-white cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px] overflow-hidden">
                <p className="text-muted-foreground">{note.content}</p>
                <p className="text-sm text-muted-foreground mt-4">
                  {note.createdAt.toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{selectedNote?.content}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Created on {selectedNote?.createdAt.toLocaleDateString()}
              </p>
              <Button variant="outline" onClick={() => setSelectedNote(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 