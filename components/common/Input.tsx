import React from 'react';

type InputProps = Partial<
  React.HTMLProps<HTMLInputElement> & {
    label: React.ReactNode;
    wrapperClass: string;
    icon: { elements: React.ReactNode[]; position: 'left' | 'right' | 'both' };
  }
>;

const Input: React.FC<InputProps> = ({
  type,
  className = '',
  wrapperClass = '',
  id,
  label = null,
  icon,
  ...props
}) => {
  const iconSpacingClass = icon
    ? (() => {
        switch (icon.position) {
          case 'both':
            return 'pl-12 pr-16';
          case 'left':
            return `pl-12`;
          default:
            return `pr-12`;
        }
      })()
    : '';

  return (
    <div
      className={`input-wrapper max-w-[95%] md:w-[450px] mx-auto ${wrapperClass}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="font-medium inline-block mb-1 text-fakeblack"
        >
          {label}
        </label>
      )}
      <br />

      <div className="input-wrapper--inner relative">
        {icon && (
          <>
            {icon.elements[0]}

            {icon.elements.length === 2 && icon.elements[1]}
          </>
        )}

        <input
          type={type || 'text'}
          id={id}
          className={`px-5 py-3 ${iconSpacingClass} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
