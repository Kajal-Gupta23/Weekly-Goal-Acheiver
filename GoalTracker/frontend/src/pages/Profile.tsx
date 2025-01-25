import React, { useEffect, useState } from 'react';
import { User, Award, Target } from 'lucide-react';
import axios from '../api/axios';

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const username = localStorage.getItem('username'); // Replace with your method to get logged-in username
        const response = await axios.get(`/user-detail/?username=${username}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profileData.username}</h1>
                <p className="text-blue-100">{profileData.email}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{profileData.completed_goals_count}</div>
                <div className="text-sm text-gray-600">Goals Completed</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{profileData.badges.length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{profileData.points}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Badges</h2>
                <div className="grid grid-cols-4 gap-4">
                  {profileData.badges.map((badge: string, i: number) => (
                    <div key={i} className="flex flex-col items-center">
                      <Award className="w-12 h-12 text-yellow-500" />
                      <span className="text-sm mt-2">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="font-semibold">0 days</span> {/* Replace with dynamic data */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Streak</span>
                    <span className="font-semibold">0 days</span> {/* Replace with dynamic data */}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">0%</span> {/* Replace with dynamic data */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
