
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddSubjectDialogProps {
  onAddSubject: (name: string, minAttendance: number, attended: number, total: number) => void;
}

export const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({ onAddSubject }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [minAttendance, setMinAttendance] = useState(75);
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddSubject(name.trim(), minAttendance, attended, total);
      setName('');
      setMinAttendance(75);
      setAttended(0);
      setTotal(0);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to track your attendance.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              placeholder="e.g., Mathematics, Physics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-attendance">Minimum Attendance (%)</Label>
            <Input
              id="min-attendance"
              type="number"
              min="0"
              max="100"
              placeholder="75"
              value={minAttendance}
              onChange={(e) => setMinAttendance(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attended">Classes Attended</Label>
            <Input
              id="attended"
              type="number"
              min="0"
              placeholder="0"
              value={attended}
              onChange={(e) => setAttended(Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total">Total Classes Held</Label>
            <Input
              id="total"
              type="number"
              min="0"
              placeholder="0"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
