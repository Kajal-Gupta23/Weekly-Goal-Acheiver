import React, { useEffect, useState } from 'react';
import { Trophy, Award, Target, TrendingUp, Clock, Bell, Users, ChevronRight, Flame, Sparkles, Rocket, Zap, Crown } from 'lucide-react';
import Button from '../components/Button';
import axios from '../api/axios'; // Adjust the import path if needed

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string>('User'); // Default to 'User' if username isn't fetched
  const [recentGoals, setRecentGoals] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]); // State for badges
  const [activities, setActivities] = useState<any[]>([]);
  const icons = [Rocket, Zap, Target, Trophy, Award, Flame, Sparkles]; // Array of icons
  const gradients = [
    'from-red-500 to-pink-500',
    'from-yellow-500 to-orange-500',
    'from-green-500 to-emerald-500',
    'from-blue-500 to-violet-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-red-500',
    'from-teal-500 to-cyan-500',
  ]; // Array of gradient classes for diversity


  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = localStorage.getItem('username')?.replace(/^"|"$/g, '');;
        setUsername(username || 'User');
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    const fetchRecentGoals = async () => {
      try {
        const response = await axios.get('/goals/', { params: { username: localStorage.getItem('username')?.replace(/^"|"$/g, ''), limit: 3 } });
        const goalsWithIcons = response.data.slice(0, 3).map((goal: any, index: number) => ({
          ...goal,
          icon: icons[Math.floor(Math.random() * icons.length)], // Assign a random icon to each goal
          gradient: gradients[index % gradients.length],
        }));
        setRecentGoals(goalsWithIcons); // Keep the most recent 3 goals
      } catch (error) {
        console.error('Error fetching recent goals:', error);
      }
    };

    const fetchBadges = async () => {
      try {
        const response = await axios.get('/badges/', {
          params: { username: localStorage.getItem('username') },
        });
        const badgesWithIcons = response.data.map((badge: any, index: number) => ({
          ...badge,
          icon: icons[index % icons.length], // Assign icons sequentially or repeat
          gradient: gradients[index % gradients.length],
        }));
        setBadges(badgesWithIcons); // Set badges dynamically
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await axios.get('/notifications/', {
          params: { username: localStorage.getItem('username')?.replace(/^"|"$/g, ''); },
        });
        const activitiesWithIcons = response.data.map((activity: any, index: number) => ({
          ...activity,
          icon: icons[index % icons.length], // Assign icons sequentially or repeat
          gradient: gradients[index % gradients.length],
        }));
        setActivities(activitiesWithIcons);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchUsername();
    fetchRecentGoals();
    fetchBadges();
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-[#FCFCFF]">
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 to-accent-light/20 rounded-full blur-3xl animate-float delay-200" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-morphism rounded-3xl p-8 col-span-2 bg-gradient-to-br from-primary/90 to-primary">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-8 h-8 text-yellow-400 animate-pulse" />
                  <h1 className="text-4xl font-bold text-white">Hey {username}! 🚀</h1>
                </div>
                <p className="text-light/80">Level 12 Goal Crusher</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                  <div className="bg-gradient-to-r from-accent to-accent-light h-2 rounded-full transition-all duration-500 w-[75%]" />
                </div>
                <p className="text-xs text-light/60">750 XP to next level</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="bg-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                    <Flame className="w-7 h-7 text-accent-light" />
                  </div>
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-light/60">Day Streak</div>
                </div>
                <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="bg-accent/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-2 mx-auto">
                    <Sparkles className="w-7 h-7 text-accent-light" />
                  </div>
                  <div className="text-2xl font-bold text-white">850</div>
                  <div className="text-xs text-light/60">Points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-morphism rounded-3xl p-6 bg-gradient-to-br from-accent/90 to-accent">
            <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-white" />
                  <span className="text-light">Goals Completed</span>
                </div>
                <span className="text-xl font-bold text-white">24</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-light">Achievements</span>
                </div>
                <span className="text-xl font-bold text-white">15</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="text-light">Success Rate</span>
                </div>
                <span className="text-xl font-bold text-white">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            {/* Recent Goals with Timeline */}
            <div className="glass-morphism rounded-3xl p-8 bg-white/80">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Recent Goals</h2>
                  <p className="text-secondary text-sm">Your latest missions 🎯</p>
                </div>
              </div>

              <div className="space-y-6">
                {recentGoals.map((goal, index) => (

                  <div
                    key={index}
                    className="relative flex items-center bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl bg-gradient-to-b ${goal.gradient}`} />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${goal.gradient} text-white`}>
                          {React.createElement(goal.icon, { className: "w-6 h-6" })}

                        </div>
                        <div>
                          <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">{goal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{goal.type}</span>
                            <span className="text-xs text-secondary flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {goal.due_date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{goal.progress || 0}%</div>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-2">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500`}
                            style={{ width: `${goal.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="space-y-6">
                {[
                  { title: 'Complete React Project', progress: 75, dueDate: '2d left', category: 'Dev', icon: Rocket, color: 'from-blue-500 to-violet-500' },
                  { title: 'Morning Workout', progress: 60, dueDate: '5d left', category: 'Health', icon: Zap, color: 'from-green-500 to-emerald-500' },
                  { title: 'Read "Atomic Habits"', progress: 30, dueDate: 'Today', category: 'Growth', icon: Target, color: 'from-orange-500 to-red-500' }
                ].map((goal, index) => (
                  <div 
                    key={index} 
                    className="relative flex items-center bg-white rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl bg-gradient-to-b ${goal.color}`} />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${goal.color} text-white`}>
                          <goal.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">{goal.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{goal.category}</span>
                            <span className="text-xs text-secondary flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {goal.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{goal.progress}%</div>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-2">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Achievement Showcase */}
            {/* <div className="glass-morphism rounded-3xl p-8 bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Achievement Unlocked!</h2>
                  <p className="text-secondary text-sm">Your latest victories 🏆</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Trophy, color: 'from-yellow-400 to-orange-500', name: 'Goal Master', desc: 'Completed 10 goals', xp: '+500 XP' },
                  { icon: Award, color: 'from-blue-400 to-indigo-500', name: 'Consistency King', desc: '7 day streak', xp: '+300 XP' },
                  { icon: Target, color: 'from-green-400 to-emerald-500', name: 'Perfect Focus', desc: '100% completion rate', xp: '+400 XP' },
                  { icon: Flame, color: 'from-red-400 to-pink-500', name: 'On Fire', desc: '5 goals in a day', xp: '+600 XP' }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${badge.color}`}>
                      <badge.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary group-hover:text-accent transition-colors">{badge.name}</div>
                      <div className="text-xs text-secondary">{badge.desc}</div>
                      <div className="text-xs font-medium text-accent mt-1">{badge.xp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

            {/* Achievement Showcase */}
            <div className="glass-morphism rounded-3xl p-8 bg-white/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Achievement Unlocked!</h2>
                  <p className="text-secondary text-sm">Your latest victories 🏆</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${badge.gradient}`}
                    >
                      {React.createElement(badge.icon, { className: 'w-8 h-8 text-white' })}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary group-hover:text-accent transition-colors">
                        {badge.name}
                      </div>
                      <div className="text-xs text-secondary">{badge.description}</div>
                      <div className="text-xs font-medium text-accent mt-1">{badge.xp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          {/* <div className="col-span-12 lg:col-span-4">
            <div className="glass-morphism rounded-3xl p-8 bg-white/80 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Activity</h2>
                  <p className="text-secondary text-sm">Your recent moves 🔥</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {[
                  { icon: Trophy, message: 'Earned "Early Bird" badge', time: '2h ago', type: 'achievement', color: 'from-yellow-400 to-orange-500' },
                  { icon: Target, message: 'Completed "Daily Meditation"', time: '5h ago', type: 'completion', color: 'from-green-400 to-emerald-500' },
                  { icon: Flame, message: '5 day streak! Keep it up!', time: '1d ago', type: 'streak', color: 'from-red-400 to-pink-500' },
                  { icon: Award, message: 'New personal best!', time: '2d ago', type: 'achievement', color: 'from-blue-400 to-indigo-500' }
                ].map((activity, index) => (
                  <div key={index} className="flex gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${activity.color}`}>
                      <activity.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary group-hover:text-accent transition-colors">{activity.message}</p>
                      <span className="text-xs text-secondary">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div> */}

          {/* {!hasActivity && (
                <div className="text-center py-8 bg-white rounded-2xl">
                  <Bell className="w-12 h-12 text-tertiary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-primary mb-2">All Caught Up!</h3>
                  <p className="text-secondary">Time to make some moves! 🚀</p>
                </div>
              )} */}

          <div className="col-span-12 lg:col-span-4">
            <div className="glass-morphism rounded-3xl p-8 bg-white/80 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Activity</h2>
                  <p className="text-secondary text-sm">Your recent moves 🔥</p>
                </div>
              </div>

              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${activity.gradient}`}
                    >
                      {React.createElement(activity.icon, { className: 'w-6 h-6 text-white' })}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary group-hover:text-accent transition-colors">
                        {activity.message}
                      </p>
                      <span className="text-xs text-secondary">{activity.time}</span>
                    </div>
                  </div>
                ))}

                {!activities.length && (
                  <div className="text-center py-8 bg-white rounded-2xl">
                    <Bell className="w-12 h-12 text-tertiary mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-primary mb-2">All Caught Up!</h3>
                    <p className="text-secondary">Time to make some moves! 🚀</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
