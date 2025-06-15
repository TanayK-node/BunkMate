import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export interface AttendanceCardProps {
  subject: {
    id: string;
    name: string;
    attended: number;
    total: number;
    minimum_attendance: number;
  };
  minPercentage: number;
  onUpdate: (subject: AttendanceCardProps["subject"]) => void;
  onDelete: (subjectId: string) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  subject,
  minPercentage,
  onUpdate,
  onDelete,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const attendancePercentage =
    subject.total > 0 ? (subject.attended / subject.total) * 100 : 0;

  const getAttendanceColor = () => {
    if (attendancePercentage >= minPercentage) {
      return "text-green-500";
    } else if (attendancePercentage >= minPercentage - 10) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <Card className="relative group transition duration-200 hover:shadow-lg">
      {/* Delete Button at top-right */}
      <div className="absolute top-4 right-4 z-10">
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-100"
              aria-label="Delete Subject"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <span className="font-semibold">{subject.name}</span>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(subject.id)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <CardHeader>
        <CardTitle>{subject.name}</CardTitle>
        <CardDescription>
          Minimum Attendance: {minPercentage}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold">Classes Attended:</span> {subject.attended}
          </div>
          <div>
            <span className="font-bold">Total Classes:</span> {subject.total}
          </div>
          <div>
            <span className="font-bold">Current Attendance:</span>
            {subject.total > 0
              ? ` ${(subject.attended / subject.total * 100).toFixed(1)}%`
              : " n/a"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
