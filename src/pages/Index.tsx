import React, { useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { AttendanceCard } from "@/components/AttendanceCard";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { useSubjects } from "@/hooks/useSubjects";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import WarningToastManager from "@/components/WarningToastManager";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { subjects, loading: subjectsLoading, addSubject, updateSubject, deleteSubject } = useSubjects();

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddSubject = (
    name: string,
    minAttendance: number,
    attended: number,
    total: number
  ) => {
    addSubject(name, minAttendance, attended, total);
  };

  // For real-time warning toasts
  // We'll call setAlert each time a card triggers a warning/danger
  const [recentAlert, setRecentAlert] = useState<{
    subjectId: string; subjectName: string; percentage: number; minPercentage: number;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Warning toast handler */}
      <WarningToastManager recentAlert={recentAlert} />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Bunk Mate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <User className="w-4 h-4 mr-1" />
                {user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Your Attendance Tracker
          </h2>
          <p className="text-gray-600">
            Keep track of your class attendance and stay above the minimum requirement
          </p>
        </div>

        {/* Add Subject Button */}
        <div className="mb-6">
          <AddSubjectDialog onAddSubject={handleAddSubject} />
        </div>

        {/* Subjects Grid */}
        {subjectsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No subjects yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first subject to start tracking attendance
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {subjects.map((subject) => (
              <AttendanceCard
                key={subject.id}
                subject={subject}
                minPercentage={subject.minimum_attendance}
                onUpdate={updateSubject}
                onDelete={deleteSubject}
                onAlertTrigger={setRecentAlert}
              />
            ))}
          </div>
        )}
      </main>

      <Toaster />
    </div>
  );
};

export default Index;
