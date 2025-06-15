import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AttendanceCard } from "@/components/AttendanceCard";
import { ThemeToggle } from "@/components/ThemeToggle";

type Subject = {
  name: string;
  attended: number;
  total: number;
};

type AttendanceData = Subject[];
type SetupFormState = {
  subjects: Subject[];
  minPercentage: number;
};

const emptySubject = (): Subject => ({
  name: "",
  attended: 0,
  total: 0,
});

const Index = () => {
  const [form, setForm] = useState<SetupFormState>({
    subjects: [emptySubject()],
    minPercentage: 75,
  });
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [minAttendance, setMinAttendance] = useState<number>(75);

  // Setup form handlers
  const handleSubjectChange = (
    idx: number,
    field: keyof Subject,
    value: string
  ) => {
    setForm((prev) => {
      const updated = prev.subjects.map((subj, i) =>
        i === idx
          ? {
              ...subj,
              [field]:
                field === "name"
                  ? value
                  : Math.max(0, Number(value.replace(/\D/g, ""))),
            }
          : subj
      );
      return { ...prev, subjects: updated };
    });
  };

  const addSubject = () => {
    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, emptySubject()],
    }));
  };

  const removeSubject = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredSubjects = form.subjects
      .filter((s) => s.name.trim())
      .map((s) => ({
        ...s,
        attended: Math.max(0, s.attended),
        total: Math.max(0, s.total),
      }));
    setAttendance(filteredSubjects);
    setMinAttendance(form.minPercentage);
  };

  // Only show setup form if attendance state hasn't been set
  if (!attendance) {
    return (
      <div className="min-h-screen flex items-center justify-center px-2 bg-background transition-all duration-300">
        <Card className="w-full max-w-lg mx-auto glass-card shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground mb-3">Attendance Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="block font-semibold text-foreground/80 mb-1">Subjects</label>
                <div className="space-y-2">
                  {form.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-2 items-stretch mb-1"
                    >
                      <Input
                        placeholder="e.g., Mathematics"
                        value={subject.name}
                        onChange={(e) =>
                          handleSubjectChange(idx, "name", e.target.value)
                        }
                        className="flex-1 bg-card/90 border border-input rounded-md focus:focus-soft placeholder:text-foreground/30 text-foreground"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g., 15"
                        value={subject.attended}
                        onChange={(e) =>
                          handleSubjectChange(idx, "attended", e.target.value)
                        }
                        className="w-20 bg-card/90 border border-input rounded-md focus:focus-soft placeholder:text-foreground/30 text-foreground"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g., 20"
                        value={subject.total}
                        onChange={(e) =>
                          handleSubjectChange(idx, "total", e.target.value)
                        }
                        className="w-20 bg-card/90 border border-input rounded-md focus:focus-soft placeholder:text-foreground/30 text-foreground"
                      />
                      {form.subjects.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeSubject(idx)}
                          title="Remove subject"
                          className="self-center"
                        >
                          &times;
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSubject}
                  className="w-full border-0 bg-gradient-to-tr from-[hsl(var(--accent))] to-[hsl(var(--accent2))] text-foreground shadow hover:brightness-110"
                >
                  + Add Subject
                </Button>
              </div>
              <div>
                <label className="block font-bold mb-1 text-foreground/80">
                  Minimum Attendance (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.minPercentage}
                  placeholder="e.g., 75"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minPercentage: Math.min(
                        100,
                        Math.max(0, Number(e.target.value.replace(/\D/g, "")))
                      ),
                    }))
                  }
                  className="w-28 bg-card/90 border border-input rounded focus:focus-soft text-foreground font-semibold"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-xl font-bold shadow group">
                Start Tracking
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  // Main attendance interface handlers
  const updateSubject = (idx: number, newSubject: Subject) => {
    setAttendance((prev) =>
      prev
        ? prev.map((subject, i) => (i === idx ? newSubject : subject))
        : prev
    );
  };

  const resetAll = () => {
    setAttendance(null!);
    setForm({
      subjects: [emptySubject()],
      minPercentage: minAttendance,
    });
  };

  return (
    <div className="min-h-screen bg-background px-3 py-8 flex flex-col transition-colors duration-300">
      <header className="mb-8 flex items-center justify-between max-w-3xl w-full mx-auto px-1">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Attendance Tracker</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetAll} size="sm" className="bg-card/80 text-foreground border border-divider hover:bg-card">
            Reset
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full mx-auto">
        {attendance.map((subject, idx) => (
          <AttendanceCard
            key={subject.name + idx}
            subject={subject}
            minPercentage={minAttendance}
            onUpdate={(updated) => updateSubject(idx, updated)}
          />
        ))}
      </div>
      <footer className="mt-auto pt-6 pb-2 text-center text-muted-foreground text-xs">
        <span className="text-foreground/40">Made with Lovable · No data is saved after closing this tab.</span>
      </footer>
    </div>
  );
};

export default Index;
