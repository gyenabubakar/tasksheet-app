import React from 'react';

type InputProps = Partial<
  React.HTMLProps<HTMLInputElement> & {
    label: React.ReactNode;
    wrapperClass: string;
  }
>;

const Input: React.FC<InputProps> = ({
  type,
  className = '',
  label = null,
  wrapperClass = '',
  id,
  ...props
}) => (
  <div className={`input-wrapper w-[400px] ${wrapperClass}`}>
    {label && <label htmlFor={id}>{label}</label>}
    <br />
    <input
      type={type || 'text'}
      id={id}
      className={` ${className}`}
      {...props}
    />
  </div>
);

export default Input;
