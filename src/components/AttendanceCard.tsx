
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";
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

// Use a limited palette for alert icons
import { CircleAlert, Trash2 } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  attended: number;
  total: number;
  minimum_attendance: number;
};

export const AttendanceCard: React.FC<{
  subject: Subject;
  minPercentage: number;
  onUpdate: (subject: Subject) => void;
  onDelete?: (id: string) => void;
  onAlertTrigger?: (alert: {
    subjectId: string;
    subjectName: string;
    percentage: number;
    minPercentage: number;
  }) => void;
}> = ({ subject, minPercentage, onUpdate, onDelete, onAlertTrigger }) => {
  const { name, attended, total } = subject;
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  const isBelowMin = percentage < minPercentage;
  const isWarning = !isBelowMin && percentage < minPercentage + 5;

  // Calculate bunkable classes using the exact formula
  const calculateBunkableClasses = () => {
    if (percentage <= 75) return 0;
    
    const present = attended;
    const totalClasses = total;
    
    // Apply the formula: (Present - (0.75 * Total)) / 0.75
    const bunkableClasses = Math.floor((present - (0.75 * totalClasses)) / 0.75);
    
    // Ensure non-negative result
    return Math.max(0, bunkableClasses);
  };

  const bunkableClasses = calculateBunkableClasses();

  // For toast manager: emit on mount & when attendance changes
  React.useEffect(() => {
    if (onAlertTrigger) {
      onAlertTrigger({
        subjectId: subject.id,
        subjectName: subject.name,
        percentage,
        minPercentage,
      });
    }
    // Note: intentionally only depends on percentage/minPercentage, not unneeded fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage, minPercentage]);

  let classesNeeded = 0;
  if (isBelowMin) {
    const needed =
      minPercentage === 100
        ? attended > total
          ? 0
          : total + 1 - attended
        : Math.ceil(
            (minPercentage * total - 100 * attended) / (100 - minPercentage)
          );
    classesNeeded = Math.max(needed, 0);
  }

  // Pastel ring color
  const ringColor = isBelowMin
    ? "#ffb3b3" // red
    : isWarning
    ? "#ffd59e" // yellow
    : "#8fbc8f"; // sage

  // Card border highlight - MAKE RED BORDER SOLID when in danger zone
  const cardBorder =
    isBelowMin
      ? "border-red-600 border-2 shadow-red-200"   // Thinner red border for danger
      : isWarning
      ? "border-yellow-400 border-2 shadow-yellow-200"
      : "";

  return (
    <Card className={`flex group transition-all duration-500 glass-card px-2 py-3 items-center relative ${cardBorder}`}>
      {/* Remove Subject Button */}
      {onDelete && (
        <div className="absolute top-2 right-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                tabIndex={0}
                aria-label="Remove subject"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove this subject?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove <b>{subject.name}</b>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(subject.id)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {/* LEFT: Circular Progress */}
      <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 min-w-24 mr-4">
        <div className="relative">
          <svg width="80" height="80" viewBox="0 0 72 72" className="block">
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="#e4e7ec"
              strokeWidth="9"
              opacity={0.6}
            />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke={ringColor}
              strokeWidth="9"
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={
                2 * Math.PI * 30 * (1 - Math.min(percentage, 100) / 100)
              }
              strokeLinecap="round"
              style={{
                transition:
                  "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1), stroke 0.3s",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.07))",
              }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-black text-foreground/80"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {percentage}%
          </span>
          {/* Visual danger/warning icon, top-right of the ring */}
          {(isBelowMin || isWarning) && (
            <span className={`absolute -top-2 right-0 bg-white rounded-full p-1 shadow ${isBelowMin ? "text-destructive" : "text-yellow-500"}`} title={isBelowMin ? "Below minimum attendance" : "Warning: close to minimum"}>
              <CircleAlert className="w-6 h-6" strokeWidth={2.3} />
            </span>
          )}
        </div>
      </div>
      {/* RIGHT: Card Info */}
      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        <div>
          <div className="text-xl md:text-2xl font-semibold tracking-wide text-foreground/90">
            {name}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <strong className="text-lg font-semibold text-foreground/80">
              {attended}
            </strong>
            <span className="text-foreground/40"> / </span>
            <strong className="text-lg font-semibold text-foreground/80">
              {total}
            </strong>
            <span className="ml-1 text-foreground/40">classes attended</span>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 shadow min-w-0 whitespace-nowrap"
            onClick={() =>
              onUpdate({
                ...subject,
                attended: attended + 1,
                total: total + 1,
              })
            }
          >
            Attended
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 shadow min-w-0 whitespace-nowrap"
            onClick={() =>
              onUpdate({
                ...subject,
                total: total + 1,
              })
            }
          >
            Missed
          </Button>
        </div>
        
        {/* New Bunk Calculator Display */}
        <div className="mt-2 text-sm font-medium">
          {percentage > 75 ? (
            <div className={`flex items-center gap-2 ${bunkableClasses > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span>{percentage.toFixed(1)}% attendance</span>
              <span className="text-gray-400">•</span>
              <span>
                {bunkableClasses > 0 
                  ? `Can bunk ${bunkableClasses} more ${bunkableClasses === 1 ? 'class' : 'classes'}`
                  : 'No more bunks available'
                }
              </span>
            </div>
          ) : (
            <span className="text-red-600">
              {percentage.toFixed(1)}% attendance
            </span>
          )}
        </div>

        <div className="mt-2 text-xs font-medium">
          {!isBelowMin && !isWarning && percentage <= 75 && (
            <span className="text-[hsl(var(--success))] flex items-center gap-2">
              <Circle
                className="w-5 h-5 text-[hsl(var(--success))]"
                strokeWidth={2}
              />{" "}
              Above minimum attendance ({minPercentage}%)
            </span>
          )}
          {isWarning && (
            <span className="text-yellow-700 bg-yellow-100 rounded px-2 py-1 flex flex-wrap items-center gap-x-2 gap-y-1 animate-pulse-slow">
              <CircleAlert className="w-5 h-5 text-yellow-700 flex-shrink-0" strokeWidth={2} />
              <span>
                Close to minimum! You're at {percentage}% (min {minPercentage}%)
              </span>
            </span>
          )}
          {isBelowMin && (
            <span
              className="text-red-800 bg-red-100 rounded px-2 py-1 flex flex-wrap items-center gap-x-2 gap-y-1 animate-pulse-slow"
              style={{ wordBreak: "break-word" }}
            >
              <CircleAlert className="w-5 h-5 text-red-800 flex-shrink-0" strokeWidth={2} />
              <span className="whitespace-nowrap">
                To reach {minPercentage}%, attend next
              </span>
              <b className="font-bold px-1">
                {classesNeeded}
              </b>
              class
              {classesNeeded !== 1 && "es"}
              <span className="ml-1">in a row</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
