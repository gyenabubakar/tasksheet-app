import React, { Children, cloneElement, ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  label?: React.ReactNode;
  wrapperClass?: string;
  error?: string | null;
  icon?: {
    elements: React.ReactElement[];
    position: 'left' | 'right' | 'both';
  };
  noErrors?: boolean;
  hideBr?: boolean;
}

const Input: React.FC<InputProps> = ({
  type,
  className = '',
  wrapperClass = '',
  id,
  label = null,
  icon,
  error,
  noErrors,
  hideBr = false,
  ...restProps
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
    <div className={`input-wrapper max-w-[95%] md:w-[450px] ${wrapperClass}`}>
      {label && (
        <label
          htmlFor={id}
          className="font-medium inline-block mb-1 text-fakeblack"
        >
          {label}
        </label>
      )}

      {!hideBr && <br />}

      <div className="input-wrapper--inner w-full relative">
        <input
          type={type || 'text'}
          id={id}
          className={`px-5 py-3 ${iconSpacingClass} ${className}`}
          {...restProps}
        />

        {icon && (
          <>
            {Children.map(icon.elements[0], (child) =>
              cloneElement(child, {
                tabIndex: '-1',
              }),
            )}

            {icon.elements.length === 2 &&
              Children.map(icon.elements[1], (child) =>
                cloneElement(child, {
                  tabIndex: '-1',
                }),
              )}
          </>
        )}
      </div>

      {noErrors !== true && (
        <div className={error ? 'visible' : 'invisible'}>
          <span className="text-red-600 text-sm font-medium min-h-[5px] inline-block">
            {error}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
