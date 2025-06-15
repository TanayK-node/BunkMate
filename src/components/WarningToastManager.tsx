
import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { CircleAlert, CircleCheckBig } from "lucide-react";

/**
 * Show toast notifications when a subject crosses into warning or danger zone.
 * Prevent repeated spamming for the same subject within the session.
 */
type AttendanceAlert = {
  subjectId: string;
  subjectName: string;
  percentage: number;
  minPercentage: number;
};

type Props = {
  recentAlert: AttendanceAlert | null;
};

const WarningToastManager: React.FC<Props> = ({ recentAlert }) => {
  const { toast } = useToast();
  // Track per-subject last shown alert to avoid spamming
  const lastAlertZone = useRef<Record<string, "safe" | "warn" | "danger"> | null>(null);

  React.useEffect(() => {
    if (!recentAlert) return;
    const { subjectId, subjectName, percentage, minPercentage } = recentAlert;

    // Calculate alert zone:
    // danger: below min; warn: within 5% above min; safe: above that
    let zone: "danger" | "warn" | "safe";
    if (percentage < minPercentage) {
      zone = "danger";
    } else if (percentage < minPercentage + 5) {
      zone = "warn";
    } else {
      zone = "safe";
    }

    if (!lastAlertZone.current) lastAlertZone.current = {};

    // Only show a toast if zone changed (for this subject)
    if (lastAlertZone.current[subjectId] !== zone) {
      // Don't toast if going back to safe (for simplicity)
      if (zone === "danger") {
        toast({
          title: (
            <span className="flex items-center gap-2 text-destructive">
              <CircleAlert className="w-5 h-5" /> Danger zone!
            </span>
          ),
          description: (
            <>
              <span>
                You are <b>below</b> the minimum attendance in <b>{subjectName}</b> ({percentage}%/{minPercentage}%).
              </span>
            </>
          ),
          variant: "destructive",
        });
      } else if (zone === "warn") {
        toast({
          title: (
            <span className="flex items-center gap-2 text-yellow-600">
              <CircleAlert className="w-5 h-5" /> Warning!
            </span>
          ),
          description: (
            <>
              <span>
                Your attendance in <b>{subjectName}</b> is getting close to the minimum ({percentage}%/{minPercentage}%).
              </span>
            </>
          ),
          variant: "default",
        });
      }
      lastAlertZone.current[subjectId] = zone;
    }
  }, [recentAlert, toast]);

  return null;
};

export default WarningToastManager;

