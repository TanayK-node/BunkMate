
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AttendanceCard } from "@/components/AttendanceCard";

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
      <div className="min-h-screen flex items-center justify-center px-2 bg-background">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Attendance Tracker Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block font-medium mb-1">Subjects</label>
                {form.subjects.map((subject, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row gap-2 items-stretch mb-2"
                  >
                    <Input
                      placeholder="Subject name"
                      value={subject.name}
                      onChange={(e) =>
                        handleSubjectChange(idx, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Attended"
                      value={subject.attended}
                      onChange={(e) =>
                        handleSubjectChange(idx, "attended", e.target.value)
                      }
                      className="w-28"
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Total"
                      value={subject.total}
                      onChange={(e) =>
                        handleSubjectChange(idx, "total", e.target.value)
                      }
                      className="w-28"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSubject}
                  className="w-full"
                >
                  + Add Subject
                </Button>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Minimum Attendance (%)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.minPercentage}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minPercentage: Math.min(
                        100,
                        Math.max(0, Number(e.target.value.replace(/\D/g, "")))
                      ),
                    }))
                  }
                  className="w-32"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">
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
    <div className="min-h-screen bg-background px-2 py-6 flex flex-col">
      <header className="mb-6 flex items-center justify-between max-w-3xl w-full mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">
          Attendance Tracker
        </h1>
        <Button variant="outline" onClick={resetAll} size="sm">
          Reset
        </Button>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full mx-auto">
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
        Made with Lovable · No data is saved after closing this tab.
      </footer>
    </div>
  );
};

export default Index;
