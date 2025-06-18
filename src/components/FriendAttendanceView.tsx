
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { useFriendAttendance } from '@/hooks/useFriendAttendance';

interface FriendAttendanceViewProps {
  friendId: string;
  friendName: string;
  onBack: () => void;
}

export const FriendAttendanceView: React.FC<FriendAttendanceViewProps> = ({
  friendId,
  friendName,
  onBack
}) => {
  const { subjects, loading } = useFriendAttendance(friendId);

  const calculateAttendanceInfo = (attended: number, total: number, minPercentage: number) => {
    if (total === 0) return { percentage: 0, bunkable: 0, status: 'neutral' };
    
    const percentage = (attended / total) * 100;
    
    if (percentage > 75) {
      const bunkableClasses = Math.floor((attended - (0.75 * total)) / 0.75);
      const safeBunks = Math.max(0, bunkableClasses);
      return { 
        percentage: Math.round(percentage * 10) / 10, 
        bunkable: safeBunks, 
        status: 'good' as const 
      };
    }
    
    return { 
      percentage: Math.round(percentage * 10) / 10, 
      bunkable: 0, 
      status: percentage >= minPercentage ? 'ok' : 'warning' as const 
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{friendName}'s Attendance</h2>
          <p className="text-gray-600">View your friend's attendance progress</p>
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-500">
              {friendName} hasn't added any subjects yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {subjects.map((subject) => {
            const attendanceInfo = calculateAttendanceInfo(
              subject.classes_attended,
              subject.total_classes,
              subject.minimum_attendance
            );

            return (
              <Card key={subject.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg font-semibold truncate">
                      {subject.name}
                    </span>
                    <div className="flex items-center">
                      {attendanceInfo.status === 'good' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : attendanceInfo.status === 'warning' ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <div className="w-5 h-5 bg-yellow-400 rounded-full" />
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Attendance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{subject.classes_attended}/{subject.total_classes} classes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          attendanceInfo.status === 'good'
                            ? 'bg-green-500'
                            : attendanceInfo.status === 'warning'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (subject.classes_attended / Math.max(1, subject.total_classes)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Attendance Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Attendance</span>
                      <div className="text-right">
                        <span
                          className={`text-lg font-bold ${
                            attendanceInfo.status === 'good'
                              ? 'text-green-600'
                              : attendanceInfo.status === 'warning'
                              ? 'text-red-600'
                              : 'text-yellow-600'
                          }`}
                        >
                          {attendanceInfo.percentage}%
                        </span>
                        {attendanceInfo.status === 'good' && attendanceInfo.bunkable > 0 && (
                          <p className="text-xs text-green-600">
                            • Can bunk {attendanceInfo.bunkable} more
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Required</span>
                      <span>{subject.minimum_attendance}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
