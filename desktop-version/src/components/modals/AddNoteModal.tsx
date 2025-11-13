import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Note {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  existingNotes?: Note[];
}

export const AddNoteModal = ({
  open,
  onOpenChange,
  appointmentId,
  existingNotes = [],
}: AddNoteModalProps) => {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>(existingNotes);

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newNote: Note = {
      id: `NOTE-${Date.now()}`,
      text: noteText,
      createdBy: "Current User",
      createdAt: new Date().toLocaleString(),
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Enter Note</Label>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note here..."
              className="min-h-[100px]"
            />
          </div>

          <Button onClick={handleAddNote} className="w-full">
            Add
          </Button>

          {notes.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Existing Notes</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <p className="text-sm text-foreground mb-2">{note.text}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Created by: {note.createdBy}</span>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
