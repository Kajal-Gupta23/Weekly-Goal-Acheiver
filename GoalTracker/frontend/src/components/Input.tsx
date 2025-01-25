import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 ${icon ? 'pl-10' : ''} py-2.5 rounded-lg 
            bg-white/50 backdrop-blur-sm border border-tertiary/30
            focus:ring-2 focus:ring-accent/20 focus:border-accent
            outline-none transition-all duration-300
            placeholder:text-secondary/50
            ${error ? 'border-red-500' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;