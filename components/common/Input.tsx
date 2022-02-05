import React from 'react';

type InputProps = Partial<React.HTMLProps<HTMLInputElement>>;

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <div className={`input-group ${className}`} {...props}>
    <input type="text" />
  </div>
);

export default Input;
