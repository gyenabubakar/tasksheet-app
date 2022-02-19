import { useEffect } from 'react';
import { useRouter } from 'next/router';

function LogoutLoadingOverlay() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      await router.push('/');
    }, 3000);
  }, []);

  return (
    <div className="fixed w-screen h-screen top-0 left-0 right-0 bottom-0 bg-[rgba(255,255,255,0.9)] flex flex-col items-center justify-center z-30">
      <svg
        className="animate-spin -ml-1 mr-3 w-16 h-16 md:w-24 md:h-24 lg:h-36 lg:w-36 text-white"
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

      <h1 className="text-3xl font-bold text-center text-gray-600 mt-10">
        Logging out...
      </h1>
    </div>
  );
}

export default LogoutLoadingOverlay;
