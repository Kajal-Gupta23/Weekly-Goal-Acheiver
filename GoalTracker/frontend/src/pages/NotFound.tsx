import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-light/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center relative animate-scale">
        <div className="animate-float inline-block mb-8">
          <div className="bg-accent/10 w-24 h-24 rounded-xl flex items-center justify-center">
            <AlertOctagon className="w-12 h-12 text-accent-light" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-4">
          Oops! Page not found
        </h1>
        <p className="text-light/60 text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          variant="neo"
          onClick={() => navigate('/')}
          className="inline-flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;