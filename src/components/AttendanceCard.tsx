
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Subject = {
  name: string;
  attended: number;
  total: number;
};

export const AttendanceCard: React.FC<{
  subject: Subject;
  minPercentage: number;
  onUpdate: (subject: Subject) => void;
}> = ({ subject, minPercentage, onUpdate }) => {
  const { name, attended, total } = subject;
  const percentage =
    total > 0 ? Math.round((attended / total) * 100) : 0;
  const isAboveMin = percentage >= minPercentage;

  // Calculate how many more classes needed to reach requirement
  let classesNeeded = 0;
  if (percentage < minPercentage) {
    // Formula: (min% * total - 100 * attended) / (100 - min%)
    const needed =
      minPercentage === 100
        ? attended > total
          ? 0
          : total + 1 - attended
        : Math.ceil(
            (minPercentage * total - 100 * attended) /
              (100 - minPercentage)
          );
    classesNeeded = Math.max(needed, 0);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <div className="text-sm text-muted-foreground">
          <span>
            <strong>{attended}</strong> / <strong>{total}</strong>{" "}
            classes attended
          </span>
        </div>
        <div
          className={
            "text-xl font-bold " +
            (isAboveMin
              ? "text-green-600"
              : "text-red-600")
          }
        >
          {percentage}%
        </div>
        <div className="flex gap-3 mt-2">
          <Button
            variant="default"
            size="lg"
            className="flex-1"
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
            size="lg"
            className="flex-1"
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
        <div className="mt-4 text-xs">
          {isAboveMin ? (
            <span className="text-green-700">
              Above minimum attendance ({minPercentage}%)
            </span>
          ) : (
            <span className="text-red-700">
              To reach {minPercentage}%, attend next{" "}
              <b>{classesNeeded}</b> class
              {classesNeeded !== 1 && "es"} in a row
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
