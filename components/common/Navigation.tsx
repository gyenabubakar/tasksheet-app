import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';

import iconArrowLeft from '~/assets/icons/arrow-left.svg';

interface Props {
  backUrl?: string;
}

const Navigation: React.FC<Props> = ({ backUrl, children }) => {
  const router = useRouter();

  return (
    <div className="button-wrapper mb-10 flex items-center justify-between">
      <button
        onClick={async () => {
          if (backUrl) {
            await router.push(backUrl);
            return;
          }
          router.back();
        }}
      >
        <a>
          <Image src={iconArrowLeft} width="19px" height="14px" />
          <span className="inline-block ml-3 font-medium">Back </span>
        </a>
      </button>

      {children}
    </div>
  );
};

export default Navigation;
