
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type FriendSubject = {
  id: string;
  name: string;
  classes_attended: number;
  total_classes: number;
  minimum_attendance: number;
  created_at: string;
};

export const useFriendAttendance = (friendId: string | null) => {
  const [subjects, setSubjects] = useState<FriendSubject[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFriendSubjects = async () => {
    if (!friendId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', friendId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubjects(data || []);
    } catch (error: any) {
      console.error('Error fetching friend subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load friend's attendance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendSubjects();
  }, [friendId]);

  return {
    subjects,
    loading,
    refetch: fetchFriendSubjects
  };
};
