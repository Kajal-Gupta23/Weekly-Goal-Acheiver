import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Trophy, Mail, Lock, ArrowLeft } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login/', formData);
      localStorage.setItem('username', response.data.username); // Save username to localStorage
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }

    try {
      // Send login data to backend
      const response = await axios.post('/login/', formData);

      // Save user data or tokens in localStorage
      localStorage.setItem('user', JSON.stringify(response.data.username));
      alert('Login successful!');
      navigate('/dashboard'); // Redirect after successful login
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid username or password.');
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
              Welcome Back
            </h2>
            <p className="text-light/60">Log in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                icon={<Mail className="w-5 h-5" />}
                label="Username"
                type="text"
                placeholder="Enter your username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-white/5 text-white placeholder:text-white/30"
              />
              <Input
                icon={<Lock className="w-5 h-5" />}
                label="Password"
                type="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-white/5 text-white placeholder:text-white/30"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button variant="neo" type="submit" className="w-full">
              Log In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-light/60">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-accent-light hover:text-accent transition-colors font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
