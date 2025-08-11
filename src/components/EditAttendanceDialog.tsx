
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3 } from 'lucide-react';
import { Subject } from '@/hooks/useSubjects';

interface EditAttendanceDialogProps {
  subject: Subject;
  onUpdate: (subject: Subject) => void;
}

export const EditAttendanceDialog: React.FC<EditAttendanceDialogProps> = ({
  subject,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [attended, setAttended] = useState(subject.attended.toString());
  const [total, setTotal] = useState(subject.total.toString());

  const handleSave = () => {
    const attendedNum = parseInt(attended);
    const totalNum = parseInt(total);

    if (isNaN(attendedNum) || isNaN(totalNum) || attendedNum < 0 || totalNum < 0) {
      return;
    }

    if (attendedNum > totalNum) {
      return;
    }

    onUpdate({
      ...subject,
      attended: attendedNum,
      total: totalNum,
    });

    setOpen(false);
  };

  const handleCancel = () => {
    setAttended(subject.attended.toString());
    setTotal(subject.total.toString());
    setOpen(false);
  };

  const attendedNum = parseInt(attended) || 0;
  const totalNum = parseInt(total) || 0;
  const isValid = !isNaN(attendedNum) && !isNaN(totalNum) && 
                  attendedNum >= 0 && totalNum >= 0 && attendedNum <= totalNum;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          title="Edit attendance"
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance for {subject.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attended" className="text-right">
              Attended
            </Label>
            <Input
              id="attended"
              type="number"
              min="0"
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <Input
              id="total"
              type="number"
              min="0"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="col-span-3"
            />
          </div>
          {!isValid && (
            <div className="text-sm text-destructive">
              {attendedNum > totalNum 
                ? "Attended classes cannot be more than total classes"
                : "Please enter valid positive numbers"
              }
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
