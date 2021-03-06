import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'button'> {
  loading?: boolean;
  icon?: JSX.Element;
  paddingClasses?: string;
}

const Button: React.FC<Props> = ({
  loading,
  disabled,
  type = 'button',
  children,
  className = '',
  paddingClasses = 'px-20 py-4',
  icon = null,
  ...props
}) => {
  const roundedClassName = /rounded-.+/.test(className)
    ? className
    : `${className} rounded-small`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`bg-main border-2 border-main text-white font-medium ${paddingClasses} flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
        disabled ? '' : 'hover:bg-darkmain hover:border-darkmain'
      } ${roundedClassName}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && icon}

      {children}
    </button>
  );
};

export default Button;
