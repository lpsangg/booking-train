import React from 'react';

type InputProps = {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
};

const Input: React.FC<InputProps> = ({ type = 'text', value, onChange, placeholder, className, icon }) => {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center' }}>
      {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          flex: 1,
          fontSize: '1rem'
        }}
      />
    </div>
  );
};

export default Input; 