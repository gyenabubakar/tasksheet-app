import React, { useEffect } from 'react';

interface Props {
  loadingText: string;
  performTask?: () => Promise<any> | void;
}

function SplashScreen({ loadingText, performTask }: Props) {
  useEffect(() => {
    performTask?.();
  }, []);

  return (
    <div className="fixed w-screen h-screen top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,0.9)] flex flex-col items-center justify-center z-30">
      <svg
        width="70"
        height="67"
        viewBox="0 0 70 67"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M40.5015 62.2669C39.5909 62.6548 38.6103 63.0074 37.5596 63.36L32.0258 65.1936C18.1214 69.7071 10.8014 65.9341 6.28331 51.9352L1.80027 38.0069C-2.68278 24.008 1.02974 16.603 14.9342 12.0895L20.3278 10.2912C19.6624 11.9837 19.102 13.9231 18.5767 16.1093L15.1443 30.884C11.2917 47.4922 16.9305 56.6603 33.4267 60.6096L39.3107 62.0201C39.696 62.1258 40.1163 62.1964 40.5015 62.2669Z"
          fill="#5C68FF"
        />
        <path
          d="M53.1802 2.49844L47.3312 1.12324C35.6333 -1.66244 28.6635 0.629573 24.5658 9.1629C23.515 11.3139 22.6745 13.9232 21.974 16.9205L18.5417 31.6951C15.1093 46.4345 19.6274 53.6984 34.2323 57.1893L40.1163 58.5998C42.1477 59.0935 44.039 59.4108 45.7902 59.5518C56.7176 60.6097 62.5315 55.4615 65.4735 42.732L68.9059 27.9926C72.3382 13.2533 67.8552 5.95409 53.1802 2.49844Z"
          fill="#5C68FF"
        />
      </svg>

      <h1 className="text-3xl font-bold text-center text-gray-600 mt-10">
        {loadingText}
      </h1>

      <svg
        className="animate-spin w-10 h-10 mt-10"
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
    </div>
  );
}

export default SplashScreen;
