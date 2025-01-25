import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ArrowRight, Star, Target, Award, ChevronRight } from 'lucide-react';
import Button from '../components/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-light/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-accent" />
                <span className="text-xl font-bold text-white">GoalTracker</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="glass" size="sm" onClick={() => navigate('/login')}>
                  Log In
                </Button>
                <Button variant="neo" size="sm" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center animate-slide-up">
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Achieve More,
              <span className="block text-gradient">Track Better</span>
            </h1>
            
            <p className="text-xl text-light/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your goals into achievements with our powerful tracking system.
              Set targets, earn rewards, and celebrate every milestone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
              <Button
                variant="neo"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() => navigate('/signup')}
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => navigate('/login')}
              >
                Explore Features
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Target className="w-10 h-10" />,
                  title: "Smart Goal Setting",
                  description: "Set and track your goals with our intuitive system"
                },
                {
                  icon: <Award className="w-10 h-10" />,
                  title: "Achievement Badges",
                  description: "Earn unique badges as you reach milestones"
                },
                {
                  icon: <Star className="w-10 h-10" />,
                  title: "Progress Analytics",
                  description: "Visualize your journey with detailed insights"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-morphism p-8 rounded-2xl hover-card group cursor-pointer"
                >
                  <div className="bg-accent/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-accent-light group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-light/70">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;