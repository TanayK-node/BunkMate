
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
    <Card className="flex flex-col group transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold tracking-wider drop-shadow-md text-white/90">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            <strong className="text-lg font-semibold text-white/80">{attended}</strong>
            <span className="text-white/50"> / </span>
            <strong className="text-lg font-semibold text-white/80">{total}</strong>
            <span className="ml-1 text-white/60">classes</span>
          </span>
        </div>
        <div className="flex items-center justify-center my-2">
          {/* Animated-gradient percentage number, large */}
          <span
            className={
              "text-4xl md:text-5xl font-black bg-gradient-to-tr " +
              (isAboveMin
                ? "from-[#2fff7f] via-[#30feea] to-[#55aaff] text-transparent bg-clip-text"
                : "from-[#ff4f64] via-[#ffcb3b] to-[#fee440] text-transparent bg-clip-text animate-pulse")
            }
            style={{ transition: "color 0.5s, background 0.5s" }}
          >
            {percentage}%
          </span>
        </div>
        <div className="flex gap-4 mt-4">
          <Button
            variant="default"
            size="lg"
            className="flex-1 shadow-xl"
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
            className="flex-1 shadow-xl"
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
        <div className="mt-6 text-xs font-medium">
          {isAboveMin ? (
            <span className="text-green-300/80">
              <span className="inline-block animate-pulse">✔</span> Above minimum attendance ({minPercentage}%)
            </span>
          ) : (
            <span className="text-yellow-200 bg-yellow-900/20 rounded px-2 py-1">
              To reach {minPercentage}%, attend next{" "}
              <b className="font-bold text-yellow-400">{classesNeeded}</b> class
              {classesNeeded !== 1 && "es"} in a row
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
