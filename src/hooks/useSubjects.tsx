
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Subject = {
  id: string;
  name: string;
  attended: number;
  total: number;
  minimum_attendance: number;
};

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedSubjects: Subject[] = data?.map(subject => ({
        id: subject.id,
        name: subject.name,
        attended: subject.classes_attended || 0,
        total: subject.total_classes || 0,
        minimum_attendance: subject.minimum_attendance || 75
      })) || [];

      setSubjects(formattedSubjects);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Modified addSubject to accept attended and total params
  const addSubject = async (
    name: string,
    minAttendance: number = 75,
    attended: number = 0,
    total: number = 0
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name,
          user_id: user.id,
          minimum_attendance: minAttendance,
          classes_attended: attended,
          total_classes: total
        })
        .select()
        .single();

      if (error) throw error;

      const newSubject: Subject = {
        id: data.id,
        name: data.name,
        attended: data.classes_attended || 0,
        total: data.total_classes || 0,
        minimum_attendance: data.minimum_attendance || 75
      };

      setSubjects(prev => [...prev, newSubject]);
      
      toast({
        title: "Success",
        description: `Subject "${name}" added successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateSubject = async (updatedSubject: Subject) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          classes_attended: updatedSubject.attended,
          total_classes: updatedSubject.total
        })
        .eq('id', updatedSubject.id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Record attendance
      const { error: recordError } = await supabase
        .from('attendance_records')
        .insert({
          subject_id: updatedSubject.id,
          user_id: user.id,
          attended: updatedSubject.attended > subjects.find(s => s.id === updatedSubject.id)?.attended
        });

      if (recordError) throw recordError;

      setSubjects(prev => 
        prev.map(subject => 
          subject.id === updatedSubject.id ? updatedSubject : subject
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSubject = async (subjectId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      
      toast({
        title: "Success",
        description: "Subject deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  return {
    subjects,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects
  };
};
