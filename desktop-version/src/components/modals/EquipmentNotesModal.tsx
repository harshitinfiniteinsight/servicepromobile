import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EquipmentNotesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: any;
}

export function EquipmentNotesModal({ open, onOpenChange, equipment }: EquipmentNotesModalProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    toast({
      title: "Note Added",
      description: "Your note has been saved successfully.",
    });
    setNewNote("");
  };

  if (!equipment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Equipment Notes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted/20 rounded-lg">
            <p className="font-semibold text-foreground">{equipment.name}</p>
            <p className="text-sm text-muted-foreground">Serial: {equipment.serialNumber}</p>
          </div>

          <div>
            <Label htmlFor="newNote">Add Note</Label>
            <Textarea
              id="newNote"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              rows={3}
              className="mt-2"
            />
            <Button onClick={handleAddNote} className="mt-2 w-full sm:w-auto">
              Add Note
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Past Notes</Label>
            {equipment.notes && equipment.notes.length > 0 ? (
              <div className="space-y-2">
                {equipment.notes.map((note: any, index: number) => (
                  <Card key={index} className="border-0 bg-muted/20">
                    <CardContent className="p-4">
                      <p className="text-sm text-foreground mb-2">{note.text}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Created by: {note.createdBy}</span>
                        <span>{note.createdAt}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic p-4 bg-muted/10 rounded-lg">
                No notes yet
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
