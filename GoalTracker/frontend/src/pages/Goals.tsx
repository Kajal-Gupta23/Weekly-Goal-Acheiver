import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import axios from '../api/axios';

interface Group {
  id: number;
  name: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  timeline: string;
  scope: string;
  visibility: string;
  group: number | null; // Nullable foreign key
  start_date: string;
  end_date: string;
  is_completed: boolean;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [groups, setGroups] = useState<Group[]>([]); // For fetching existing groups
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeline: 'daily',
    scope: 'individual',
    visibility: 'private',
    group: null,
    start_date: '',
    end_date: '',
  });
  const username = localStorage.getItem('username')?.replace(/^"|"$/g, '');;

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/goals/?username=${username}`);
        setGoals(response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await axios.get(`/groups/?username=${username}`); // Adjust endpoint if needed
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchGoals();
    fetchGroups();
  }, [username]);

  const handleMarkComplete = async (goalId: number) => {
    try {
      await axios.patch(`/goals/${goalId}/`, { is_completed: true });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, is_completed: true } : goal
        )
      );
    } catch (error) {
      console.error('Error marking goal as complete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/goals/', {
        title: formData.title,
        description: formData.description,
        timeline: formData.timeline,
        scope: formData.scope,
        visibility: formData.visibility,
        group: formData.group,
        start_date: formData.start_date,
        end_date: formData.end_date,
        username, // Attach the username to associate the goal with the user
      });
      setGoals((prevGoals) => [...prevGoals, response.data]);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        timeline: 'daily',
        scope: 'individual',
        visibility: 'private',
        group: null,
        start_date: '',
        end_date: '',
      });
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          New Goal
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Create New Goal</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select
                value={formData.group || ''}
                onChange={(e) => setFormData({ ...formData, group: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select Group (Optional)</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Goal</Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold">{goal.title}</h3>
                  <p className="text-sm text-gray-600">
                    {goal.timeline.charAt(0).toUpperCase() + goal.timeline.slice(1)} •{' '}
                    {goal.is_completed ? 'Completed' : 'In Progress'}
                  </p>
                </div>
              </div>
              {goal.is_completed ? (
                <Button variant="outline" size="sm" disabled>
                  <CheckCircle className="w-5 h-5 mr-1 text-green-500" />
                  Completed
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleMarkComplete(goal.id)}>
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
