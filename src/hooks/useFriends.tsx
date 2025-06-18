
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type Friend = {
  id: string;
  friend_id: string;
  friend_name: string;
  unique_id: string;
  added_at: string;
};

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFriends = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          friend_id,
          friend_name,
          added_at,
          profiles!friends_friend_id_fkey(unique_id)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedFriends: Friend[] = data?.map(friend => ({
        id: friend.id,
        friend_id: friend.friend_id,
        friend_name: friend.friend_name,
        unique_id: (friend.profiles as any)?.unique_id || '',
        added_at: friend.added_at
      })) || [];

      setFriends(formattedFriends);
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

  const addFriend = async (friendUniqueId: string) => {
    if (!user) return;

    try {
      // First, find the friend by unique_id
      const { data: friendProfile, error: findError } = await supabase
        .from('profiles')
        .select('id, full_name, unique_id')
        .eq('unique_id', friendUniqueId)
        .single();

      if (findError) {
        toast({
          title: "Friend not found",
          description: "No user found with that ID.",
          variant: "destructive",
        });
        return;
      }

      // Check if trying to add self
      if (friendProfile.id === user.id) {
        toast({
          title: "Invalid action",
          description: "You cannot add yourself as a friend.",
          variant: "destructive",
        });
        return;
      }

      // Check if already friends
      const { data: existingFriend } = await supabase
        .from('friends')
        .select('id')
        .eq('user_id', user.id)
        .eq('friend_id', friendProfile.id)
        .single();

      if (existingFriend) {
        toast({
          title: "Already friends",
          description: "This user is already in your friends list.",
          variant: "destructive",
        });
        return;
      }

      // Add friend
      const { error: addError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendProfile.id,
          friend_name: friendProfile.full_name || 'Unknown User'
        });

      if (addError) throw addError;

      toast({
        title: "Success",
        description: `${friendProfile.full_name || 'Friend'} added successfully!`,
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend removed successfully!",
      });

      fetchFriends();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [user]);

  return {
    friends,
    loading,
    addFriend,
    removeFriend,
    refetch: fetchFriends
  };
};
