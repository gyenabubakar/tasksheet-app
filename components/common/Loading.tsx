import React from 'react';

interface Props {
  loadingText: string;
  className?: string;
}

const Loading: React.FC<Props> = ({ loadingText, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        className="animate-spin -ml-1 mr-3 w-10 h-10 md:w-16 md:h-16"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(92, 104, 255, 0.1)"
          strokeWidth="4"
        />
        <path
          fill="#5c68ff"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      <h1 className="text-xl md:text-2xl font-bold text-center text-gray-600 mt-10">
        {loadingText}
      </h1>
    </div>
  );
};

export default Loading;
