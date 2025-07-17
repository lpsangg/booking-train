import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', className, disabled }) => {
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button; 