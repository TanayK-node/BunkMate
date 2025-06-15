import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle } from "lucide-react";

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
  const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
  const isAboveMin = percentage >= minPercentage;
  let classesNeeded = 0;
  if (percentage < minPercentage) {
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
  const ringColor = isAboveMin
    ? "#8fbc8f" // sage
    : percentage > minPercentage - 10
    ? "#ffd59e" // soft amber
    : "#ffb3b3"; // light red

  // Animate percentage (CSS transitions for width/appearance)
  return (
    <Card className="flex group transition-all duration-500 shadow-md glass-card px-2 py-3 items-center">
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
        <div className="mt-2 text-xs font-medium">
          {isAboveMin ? (
            <span className="text-[hsl(var(--success))] flex items-center gap-2">
              <Circle
                className="w-5 h-5 text-[hsl(var(--success))]"
                strokeWidth={2}
              />{" "}
              Above minimum attendance ({minPercentage}%)
            </span>
          ) : (
            <span className="text-[hsl(var(--warning))] bg-[hsl(var(--warning),.09)] rounded px-2 py-1 flex items-center gap-2 animate-pulse-slow">
              <Circle
                className="w-5 h-5 text-[hsl(var(--warning))]"
                strokeWidth={2}
              />
              To reach {minPercentage}%, attend next{" "}
              <b className="font-bold text-[hsl(var(--warning))]">
                {classesNeeded}
              </b>{" "}
              class
              {classesNeeded !== 1 && "es"} in a row
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
