import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'neo' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-semibold transition-all duration-300 flex items-center justify-center';
  
  const variants = {
    primary: 'bg-primary text-white rounded-xl hover:shadow-[0_8px_32px_rgba(7,23,57,0.3)] hover:-translate-y-1',
    secondary: 'bg-gradient-to-r from-accent to-accent-light text-white rounded-xl hover:shadow-[0_8px_32px_rgba(166,136,104,0.3)] hover:-translate-y-1',
    neo: 'neo-brutalism bg-accent-light text-primary active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#071739]',
    glass: 'glass-morphism text-white hover:bg-white/20 rounded-xl'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;