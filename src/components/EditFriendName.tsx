
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Edit2 } from 'lucide-react';

interface EditFriendNameProps {
  friendId: string;
  currentName: string;
  customName?: string;
  onRename: (friendId: string, customName: string) => void;
}

export const EditFriendName: React.FC<EditFriendNameProps> = ({
  friendId,
  currentName,
  customName,
  onRename
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(customName || currentName);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== currentName) {
      onRename(friendId, trimmedValue);
    } else if (!trimmedValue || trimmedValue === currentName) {
      // Reset to original name if empty or same as original
      onRename(friendId, '');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(customName || currentName);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 w-full">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="flex-1 h-8 text-sm"
          placeholder="Enter custom name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
        >
          <Check className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <p className="font-medium">{customName || currentName}</p>
        {customName && customName !== currentName && (
          <p className="text-xs text-gray-500">Real name: {currentName}</p>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
      >
        <Edit2 className="w-3 h-3" />
      </Button>
    </div>
  );
};
