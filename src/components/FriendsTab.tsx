
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, UserPlus, Trash2, User, Eye } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { FriendAttendanceView } from '@/components/FriendAttendanceView';

export const FriendsTab: React.FC = () => {
  const [friendId, setFriendId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const { friends, loading, addFriend, removeFriend } = useFriends();
  const { profile } = useProfile();
  const { toast } = useToast();

  const handleCopyId = () => {
    if (profile?.unique_id) {
      navigator.clipboard.writeText(profile.unique_id);
      toast({
        title: "Copied!",
        description: "Your friend code has been copied to clipboard.",
      });
    }
  };

  const handleAddFriend = async () => {
    if (!friendId.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a friend code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    await addFriend(friendId.trim());
    setFriendId('');
    setIsAdding(false);
  };

  const handleRemoveFriend = async (friendId: string, friendName: string) => {
    if (window.confirm(`Are you sure you want to remove ${friendName} from your friends list?`)) {
      await removeFriend(friendId);
    }
  };

  const handleViewFriend = (friend: any) => {
    console.log('Viewing friend:', friend);
    setSelectedFriend(friend);
  };

  const handleBackToFriends = () => {
    setSelectedFriend(null);
  };

  // Validate input as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 5) {
      setFriendId(value);
    }
  };

  // If viewing a friend's attendance, show that component
  if (selectedFriend) {
    return (
      <FriendAttendanceView 
        friend={selectedFriend} 
        onBack={handleBackToFriends}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* User ID Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Friend Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-blue-600">
              {profile?.unique_id || 'Loading...'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyId}
              disabled={!profile?.unique_id}
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Share this 5-digit code with friends so they can add you
          </p>
        </CardContent>
      </Card>

      {/* Add Friend Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Friend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter 5-digit friend code"
                value={friendId}
                onChange={handleInputChange}
                maxLength={5}
                className="flex-1 font-mono"
                type="text"
                inputMode="numeric"
              />
              <Button
                onClick={handleAddFriend}
                disabled={isAdding || friendId.length !== 5}
              >
                {isAdding ? 'Adding...' : 'Add'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Example: 12345 (exactly 5 digits)
            </p>
            {friendId.length > 0 && friendId.length !== 5 && (
              <p className="text-xs text-red-500">
                Friend code must be exactly 5 digits
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Friends List */}
      <Card>
        <CardHeader>
          <CardTitle>Friends ({friends.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading friends...</p>
            </div>
          ) : friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No friends added yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Add friends by their 5-digit code to see their attendance
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend, index) => (
                <div key={friend.id}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{friend.friend_name}</p>
                        <p className="text-sm text-gray-500 font-mono">#{friend.unique_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewFriend(friend)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFriend(friend.id, friend.friend_name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {index < friends.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
