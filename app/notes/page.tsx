"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import type { Note } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NotesPage() {
  const router = useRouter();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotes([]);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        setTitle("");
        setContent("");
        setOpen(false);
        fetchNotes();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-8 bg-[#F1F1EF] min-h-screen relative">
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
          {Array.isArray(notes) && notes.length > 0 ? (
            notes.map((note) => (
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
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">
              No notes yet.
            </p>
          )}
        </div>
      </div>

      {/* Floating Pen Button and Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg h-14 w-14 flex items-center justify-center"
            aria-label="Add note"
          >
            <Pen className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddNote} className="space-y-4 pt-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={loading}
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={3}
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading || !title.trim() || !content.trim()} className="w-full">
              Add Note
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
                Created on{" "}
                {selectedNote?.createdAt
                  ? new Date(selectedNote.createdAt).toLocaleDateString()
                  : ""}
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