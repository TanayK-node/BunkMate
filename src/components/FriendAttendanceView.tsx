
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FriendAttendanceViewProps {
  friend: {
    id: string;
    friend_id: string;
    friend_name: string;
    friend_code: string;
  };
  onBack: () => void;
}

interface Subject {
  id: string;
  name: string;
  classes_attended: number;
  total_classes: number;
  minimum_attendance: number;
}

export const FriendAttendanceView: React.FC<FriendAttendanceViewProps> = ({ friend, onBack }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFriendSubjects();
  }, [friend.friend_id]);

  const fetchFriendSubjects = async () => {
    try {
      console.log('Fetching subjects for friend:', friend.friend_id);
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', friend.friend_id);

      if (error) {
        console.error('Error fetching friend subjects:', error);
        throw error;
      }

      console.log('Friend subjects data:', data);
      setSubjects(data || []);
    } catch (error: any) {
      console.error('Error fetching friend subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load friend's attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = (attended: number, total: number) => {
    if (total === 0) return 0;
    return (attended / total) * 100;
  };

  const calculateBunkableClasses = (attended: number, total: number, minPercentage: number) => {
    const currentPercentage = calculateAttendancePercentage(attended, total);
    
    if (currentPercentage <= minPercentage) {
      return 0;
    }

    // Formula: (Present - (MinPercentage/100 * Total)) / (MinPercentage/100)
    const minPercentageDecimal = minPercentage / 100;
    const bunkable = Math.floor((attended - (minPercentageDecimal * total)) / minPercentageDecimal);
    return Math.max(0, bunkable);
  };

  const getAttendanceColor = (percentage: number, minPercentage: number) => {
    if (percentage < minPercentage) return 'text-red-600';
    if (percentage < minPercentage + 5) return 'text-yellow-600';
    return 'text-green-600';
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
          Back to Friends
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{friend.friend_name}'s Attendance</h2>
            <p className="text-sm text-gray-500 font-mono">Friend Code: #{friend.friend_code}</p>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance data...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-lg shadow p-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects found
            </h3>
            <p className="text-gray-500">
              {friend.friend_name} hasn't added any subjects yet
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {subjects.map((subject) => {
            const attendancePercentage = calculateAttendancePercentage(
              subject.classes_attended,
              subject.total_classes
            );
            const bunkableClasses = calculateBunkableClasses(
              subject.classes_attended,
              subject.total_classes,
              subject.minimum_attendance
            );
            const colorClass = getAttendanceColor(attendancePercentage, subject.minimum_attendance);

            return (
              <Card key={subject.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Attendance Stats */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Classes Attended</span>
                    <span className="font-semibold">
                      {subject.classes_attended}/{subject.total_classes}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        attendancePercentage >= subject.minimum_attendance
                          ? 'bg-green-500'
                          : attendancePercentage >= subject.minimum_attendance - 5
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
                    />
                  </div>

                  {/* Attendance Percentage and Bunkable Classes */}
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${colorClass}`}>
                      {attendancePercentage.toFixed(1)}% attendance
                    </span>
                    {attendancePercentage > subject.minimum_attendance && bunkableClasses > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        Can bunk {bunkableClasses} more
                      </span>
                    )}
                  </div>

                  {/* Minimum Required */}
                  <div className="text-xs text-gray-500">
                    Minimum required: {subject.minimum_attendance}%
                  </div>

                  {/* Status Indicator */}
                  {attendancePercentage < subject.minimum_attendance && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ Below minimum attendance requirement
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
