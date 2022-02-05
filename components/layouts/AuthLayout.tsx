import React from 'react';
import Image from 'next/image';
import Container from '~/components/common/Container';
import logo from '~/public/images/logo.svg';

const AuthLayout: React.FC = ({ children }) => (
  <>
    <header>
      <Container className="py-5">
        <div className="logo-wrapper flex items-center">
          <div className="logo w-[70px] h-[67px] relative">
            <Image src={logo} layout="fill" alt="TaskSheet logo" />
          </div>
          <h3 className="text-[48px] font-bold text-main ml-8 select-none">
            TaskSheet
          </h3>
        </div>
        <div className="links" />
      </Container>
    </header>

    {children}
  </>
);

export default AuthLayout;
