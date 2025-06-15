
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
      <div className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-[#101c2c] via-[#111620] to-[#2a003f]">
        <Card className="w-full max-w-lg mx-auto glass-card border-0 shadow-2xl backdrop-blur-2xl">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-extrabold bg-gradient-to-tr from-[#6a5cff] via-[#30feea] to-[#01f9c6] bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              Attendance Tracker Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block font-bold text-white/70 mb-1 tracking-wide text-lg">Subjects</label>
                <div className="space-y-2">
                  {form.subjects.map((subject, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row gap-2 items-stretch mb-1 transition-all duration-300"
                    >
                      <Input
                        placeholder="Subject name"
                        value={subject.name}
                        onChange={(e) =>
                          handleSubjectChange(idx, "name", e.target.value)
                        }
                        className="flex-1 glass-card bg-white/5 border-[hsla(var(--card-glass-border),0.12)] placeholder:text-white/50 text-white font-medium shadow-inner focus:shadow-glass focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Attended"
                        value={subject.attended}
                        onChange={(e) =>
                          handleSubjectChange(idx, "attended", e.target.value)
                        }
                        className="w-24 glass-card bg-white/5 border-[hsla(var(--card-glass-border),0.12)] placeholder:text-white/50 text-white font-medium shadow-inner focus:shadow-glass focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                      <Input
                        type="number"
                        min={0}
                        placeholder="Total"
                        value={subject.total}
                        onChange={(e) =>
                          handleSubjectChange(idx, "total", e.target.value)
                        }
                        className="w-24 glass-card bg-white/5 border-[hsla(var(--card-glass-border),0.12)] placeholder:text-white/50 text-white font-medium shadow-inner focus:shadow-glass focus:ring-2 focus:ring-primary focus:outline-none"
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
                  className="w-full border-0 bg-gradient-to-tr from-[#6a5cff] via-[#30feea] to-[#01f9c6] text-white/90 shadow hover:brightness-125 transition-all"
                >
                  + Add Subject
                </Button>
              </div>
              <div>
                <label className="block font-bold mb-1 tracking-wide text-white/70 text-lg">
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
                  className="w-32 glass-card bg-white/5 border-[hsla(var(--card-glass-border),0.12)] placeholder:text-white/50 text-white font-semibold shadow-inner focus:shadow-glass focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <Button type="submit" className="w-full h-14 text-2xl font-extrabold shadow-xl">
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
    <div className="min-h-screen bg-gradient-to-br from-[#050d1d] via-[#0b1123] to-[#32005a] px-2 py-8 flex flex-col transition-colors duration-500">
      <header className="mb-8 flex items-center justify-between max-w-3xl w-full mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight bg-gradient-to-tr from-[#30feea] via-[#60a9fa] to-[#d08ffe] bg-clip-text text-transparent drop-shadow-xl">
          Attendance Tracker
        </h1>
        <Button variant="outline" onClick={resetAll} size="sm" className="bg-white/10 border-0 text-white hover:bg-white/20">
          Reset
        </Button>
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
        <span className="text-white/40">Made with Lovable · No data is saved after closing this tab.</span>
      </footer>
    </div>
  );
};

export default Index;
