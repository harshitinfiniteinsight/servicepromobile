import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockEmployees } from "@/data/mockData";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployee?: string;
}

export function AddCategoryModal({ open, onOpenChange, selectedEmployee }: AddCategoryModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employee: selectedEmployee || "",
    categoryName: "",
    color: "#FF6B35",
  });

  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({ ...prev, employee: selectedEmployee }));
    }
  }, [selectedEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Category Added",
      description: `${formData.categoryName} has been created successfully.`,
    });
    onOpenChange(false);
    setFormData({ employee: selectedEmployee || "", categoryName: "", color: "#FF6B35" });
  };

  const colorOptions = [
    { name: "Orange", value: "#FF6B35" },
    { name: "Blue", value: "#004E89" },
    { name: "Green", value: "#22C55E" },
    { name: "Red", value: "#EF4444" },
    { name: "Purple", value: "#A855F7" },
    { name: "Yellow", value: "#F59E0B" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="employee">Select Employee *</Label>
            <Select value={formData.employee} onValueChange={(value) => setFormData({ ...formData, employee: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose employee" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="categoryName">Category Name *</Label>
            <Input
              id="categoryName"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              placeholder="e.g., Emergency Service"
              required
            />
          </div>

          <div>
            <Label htmlFor="color">Color *</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="h-10 w-20"
                required
              />
              <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: option.value }}></div>
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
