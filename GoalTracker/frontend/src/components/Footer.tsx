import React from 'react';
import { Trophy } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary/95 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-accent/10 w-10 h-10 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-accent-light" />
            </div>
            <span className="text-xl font-bold text-white">GoalTracker</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-light hover:text-accent-light transition-colors">
              Privacy
            </a>
            <a href="#" className="text-light hover:text-accent-light transition-colors">
              Terms
            </a>
            <a href="#" className="text-light hover:text-accent-light transition-colors">
              Contact
            </a>
          </div>

          <div className="text-light/60 text-sm">
            © {new Date().getFullYear()} GoalTracker. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;