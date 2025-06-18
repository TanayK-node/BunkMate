
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
      console.log('Fetching friends for user:', user.id);
      
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

      if (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }

      console.log('Friends data received:', data);

      const formattedFriends: Friend[] = data?.map(friend => ({
        id: friend.id,
        friend_id: friend.friend_id,
        friend_name: friend.friend_name,
        unique_id: (friend.profiles as any)?.unique_id || '',
        added_at: friend.added_at
      })) || [];

      console.log('Formatted friends:', formattedFriends);
      setFriends(formattedFriends);
    } catch (error: any) {
      console.error('Friends fetch error:', error);
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
      console.log('Adding friend with ID:', friendUniqueId);
      
      // Normalize the input - trim whitespace and ensure it's exactly 5 digits
      const normalizedId = friendUniqueId.trim();
      
      // Validate format - must be exactly 5 digits
      if (!/^\d{5}$/.test(normalizedId)) {
        toast({
          title: "Invalid format",
          description: "Friend code must be exactly 5 digits (e.g., 12345)",
          variant: "destructive",
        });
        return;
      }

      console.log('Searching for user with unique_id:', normalizedId);

      // First, find the friend by unique_id
      const { data: friendProfile, error: findError } = await supabase
        .from('profiles')
        .select('id, full_name, unique_id')
        .eq('unique_id', normalizedId)
        .single();

      console.log('Friend search result:', friendProfile, findError);

      if (findError || !friendProfile) {
        console.error('Friend not found:', findError);
        toast({
          title: "User not found",
          description: "No user found with friend code: " + normalizedId,
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

      console.log('Adding friend to database...');

      // Add friend
      const { error: addError } = await supabase
        .from('friends')
        .insert({
          user_id: user.id,
          friend_id: friendProfile.id,
          friend_name: friendProfile.full_name || 'Unknown User'
        });

      if (addError) {
        console.error('Error adding friend:', addError);
        throw addError;
      }

      console.log('Friend added successfully');

      toast({
        title: "Success",
        description: `${friendProfile.full_name || 'Friend'} added successfully!`,
      });

      fetchFriends();
    } catch (error: any) {
      console.error('Add friend error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add friend",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;

    try {
      console.log('Removing friend with ID:', friendId);
      
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
      console.error('Remove friend error:', error);
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
