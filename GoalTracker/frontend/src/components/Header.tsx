import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, LayoutDashboard, Target, UserCircle, LogOut, Menu, Users } from 'lucide-react';
import { clearTokens } from '../utils/auth';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = location.pathname !== '/' && 
                         location.pathname !== '/login' && 
                         location.pathname !== '/signup';

  const handleLogout = () => {
    clearTokens();
    alert('Logged out successfully!');
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-primary/95 backdrop-blur-lg sticky top-0 z-50 border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="bg-accent/10 w-10 h-10 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-light" />
            </div>
            <span className="text-xl font-bold text-white">GoalTracker</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-light hover:text-accent-light transition-colors">Dashboard</Link>
            <Link to="/goals" className="text-light hover:text-accent-light transition-colors">Goals</Link>
            <Link to="/groups" className="text-light hover:text-accent-light transition-colors">Groups</Link> {/* Added Groups */}
            <Link to="/profile" className="text-light hover:text-accent-light transition-colors">Profile</Link>
            <button onClick={handleLogout} className="text-light hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5 mr-1 inline" />
              Logout
            </button>
          </div>

          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
