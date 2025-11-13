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
import { Upload, FileImage } from "lucide-react";

interface Note {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  imageUrl?: string;
}

interface CustomerNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  existingNotes?: Note[];
}

export const CustomerNoteModal = ({
  open,
  onOpenChange,
  customerId,
  customerName,
  existingNotes = [],
}: CustomerNoteModalProps) => {
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>(existingNotes);
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;

    const newNote: Note = {
      id: `NOTE-${Date.now()}`,
      text: noteText,
      createdBy: "Current User",
      createdAt: new Date().toLocaleString(),
      imageUrl: uploadedImage || undefined,
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
    setUploadedImage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Note - {customerName}</DialogTitle>
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

          <div className="space-y-2">
            <Label>Upload Image (Optional)</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('note-image-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              {uploadedImage && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileImage className="h-4 w-4" />
                  <span>Image attached</span>
                </div>
              )}
              <input
                id="note-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {uploadedImage && (
              <img 
                src={uploadedImage} 
                alt="Preview" 
                className="mt-2 max-h-32 rounded-md border"
              />
            )}
          </div>

          <Button onClick={handleAddNote} className="w-full">
            Add Note
          </Button>

          {notes.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-sm text-muted-foreground">Existing Notes</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-muted/30 rounded-lg border border-border space-y-2"
                  >
                    <p className="text-sm text-foreground">{note.text}</p>
                    {note.imageUrl && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FileImage className="h-3 w-3" />
                        <span>Document attached</span>
                      </div>
                    )}
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>Created by: {note.createdBy}</span>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                    {note.imageUrl && (
                      <img 
                        src={note.imageUrl} 
                        alt="Note attachment" 
                        className="mt-2 max-h-32 rounded-md border"
                      />
                    )}
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
