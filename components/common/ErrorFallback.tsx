import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import illustrationNotFound from '~/assets/illustrations/not-found.svg';

interface Props {
  title?: string;
  message?: string;
}

const ErrorFallback: React.FC<Props> = ({ message, title, children }) => {
  const router = useRouter();

  return (
    <div className="error mt-24">
      {children}

      {!children && (
        <>
          <div className="w-10/12 h-32 relative mx-auto">
            <Image src={illustrationNotFound} layout="fill" />
          </div>

          <div className="description mt-12">
            <h1 className="text-xl md:text-2xl font-medium text-darkgray text-center">
              {title}
            </h1>

            <p className="text-gray-500 text-center mt-5 text-base md:text-lg">
              {message}
            </p>

            <div className="text-center mt-12">
              <button
                className="px-10 py-3 rounded-lg bg-main text-white font-medium text-sm"
                onClick={() => router.push('/app/')}
              >
                Go home
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ErrorFallback;
