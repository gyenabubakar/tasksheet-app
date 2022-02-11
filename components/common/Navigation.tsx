import { useRouter } from 'next/router';
import Image from 'next/image';
import React from 'react';

import iconArrowLeft from '~/assets/icons/arrow-left.svg';

const Navigation: React.FC = () => {
  const router = useRouter();

  return (
    <div className="button-wrapper mb-10">
      <button onClick={() => router.back()}>
        <a>
          <Image src={iconArrowLeft} width="19px" height="14px" />
          <span className="inline-block ml-3 font-medium">Back </span>
        </a>
      </button>
    </div>
  );
};

export default Navigation;
