import React, { useState } from 'react';
import Image from 'next/image';

import { RequestType } from '~/assets/ts/types';
import Button from '~/components/common/Button';

interface RequesProps {
  request: RequestType;
  onReject: (r: RequestType) => void;
  onAccept: (r: RequestType) => Promise<null>;
}

const Request: React.FC<RequesProps> = ({ request, onAccept, onReject }) => {
  const [accepting, setAccepting] = useState(false);
  const { name, avatar, email } = request.user;

  function handleAccept() {
    setAccepting(true);
    onAccept(request).finally(() => setAccepting(false));
  }

  return (
    <div className="request-card bg-white shadow-lg shadow-faintmain px-5 py-8 rounded-small flex flex-col lg:flex-row items-center">
      <div className="avatar-wrapper">
        <div className="avatar relative w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden">
          <Image src={avatar} layout="fill" />
        </div>
      </div>

      <div className="details mt-5 lg:mt-0 lg:ml-10 text-center lg:text-left">
        <p className="text-[20px] font-medium">{name}</p>
        <span className="text-base text-darkgray">{email}</span>

        <div className="actions mt-5 flex md:flex-col md:items-center xl:flex-row">
          <Button
            className="bg-transparent border-[3px] border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3 mr-3 md:mr-0 lg:mr-3"
            onClick={() => onReject(request)}
          >
            Reject
          </Button>

          <Button
            className="px-8 py-3 md:mt-3 xl:mt-0"
            loading={accepting}
            disabled={accepting}
            icon={
              <svg
                width="15"
                height="20"
                viewBox="0 0 15 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path
                  d="M7.04004 0C4.42004 0 2.29004 2.13 2.29004 4.75C2.29004 7.32 4.30004 9.4 6.92004 9.49C7.00004 9.48 7.08004 9.48 7.14004 9.49C7.16004 9.49 7.17004 9.49 7.19004 9.49C7.20004 9.49 7.20004 9.49 7.21004 9.49C9.77004 9.4 11.78 7.32 11.79 4.75C11.79 2.13 9.66004 0 7.04004 0Z"
                  fill="white"
                />
                <path
                  d="M12.12 12.16C9.33 10.3 4.78 10.3 1.97 12.16C0.7 13 0 14.15 0 15.38C0 16.61 0.7 17.75 1.96 18.59C3.36 19.53 5.2 20 7.04 20C8.88 20 10.72 19.53 12.12 18.59C13.38 17.74 14.08 16.6 14.08 15.36C14.07 14.14 13.38 12.99 12.12 12.16ZM9.37 14.56L6.85 17.08C6.73 17.2 6.57 17.26 6.41 17.26C6.25 17.26 6.09 17.19 5.97 17.08L4.71 15.82C4.47 15.58 4.47 15.18 4.71 14.94C4.95 14.7 5.35 14.7 5.59 14.94L6.41 15.76L8.49 13.68C8.73 13.44 9.13 13.44 9.37 13.68C9.62 13.92 9.62 14.32 9.37 14.56Z"
                  fill="white"
                />
              </svg>
            }
            onClick={() => handleAccept()}
          >
            {accepting ? 'On it...' : 'Accept'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Request;
