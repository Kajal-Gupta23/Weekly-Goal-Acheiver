import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Trophy, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Send signup data to backend
      const response = await axios.post('/signup/', formData);
      alert('Signup successful! You can now log in.');
      navigate('/login'); // Redirect to login page
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-light/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative animate-scale">
        <div className="glass-morphism rounded-2xl p-8">
          <button
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="animate-float inline-block">
              <div className="bg-accent/10 w-20 h-20 rounded-xl flex items-center justify-center mb-6">
                <Trophy className="w-10 h-10 text-accent-light" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gradient mb-3">
              Join Us Today
            </h2>
            <p className="text-light/60">Create your account to start tracking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                icon={<User className="w-5 h-5" />}
                label="Username"
                type="text"
                placeholder="Choose a username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-white/5 text-white placeholder:text-white/30"
              />
              <Input
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 text-white placeholder:text-white/30"
              />
              <Input
                icon={<Lock className="w-5 h-5" />}
                label="Password"
                type="password"
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button variant="neo" type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-light/60">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-accent-light hover:text-accent transition-colors font-semibold"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
