import React, { useState, useEffect } from 'react';
import { Users, Plus, X, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from '../api/axios';

interface Group {
  id: number;
  name: string;
  members: number[];
}

interface User {
  id: number;
  username: string;
}

const GroupGoals: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const username = localStorage.getItem('username')?.replace(/^"|"$/g, '');
  console.log(username) // Get the logged-in user's username

  // Fetch groups and users
  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        // Fetch groups
        const groupsResponse = await axios.get(`/groups/?username=${username}`);
        setGroups(groupsResponse.data);

        // Fetch users
        const usersResponse = await axios.get('/users/');
        setUsers(usersResponse.data);
      } catch (err) {
        console.error('Error fetching groups or users:', err);
      }
    };

    fetchGroupsAndUsers();
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!groupName.trim()) {
      setError('Group name is required.');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Please select at least one member.');
      return;
    }

    try {
      const payload = {
        name: groupName,
        members: selectedMembers,
      };

      const response = await axios.post(`/groups/?username=${username}`, payload);
      console.log('Group created successfully:', response.data);

      // Reset form and refresh groups
      setShowForm(false);
      setGroupName('');
      setSelectedMembers([]);
      setGroups((prev) => [...prev, response.data]);
    } catch (err: any) {
      console.error('Error creating group:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to create group. Please try again.');
    }
  };

  const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = Number(e.target.value);
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers((prev) => [...prev, memberId]);
    }
  };

  const removeMember = (id: number) => {
    setSelectedMembers((prev) => prev.filter((member) => member !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Group Goals</h1>
        <Button onClick={() => setShowForm(true)}>
          <UserPlus className="w-5 h-5 mr-2" />
          Create New Group
        </Button>
      </div>

      {/* Existing Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-accent/10 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-600">
                    {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Members</label>
                <select
                  onChange={handleMemberSelect}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  {selectedMembers.map((id) => {
                    const user = users.find((user) => user.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
                        <span>{user?.username}</span>
                        <button
                          type="button"
                          onClick={() => removeMember(id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupGoals;
