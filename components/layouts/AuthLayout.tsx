import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '~/components/common/Container';
import logo from '~/public/images/logo.svg';
import iconLogin from '~/assets/icons/login.svg';

const AuthLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const linkText = (() => {
    switch (router.route) {
      case '/signup':
        return 'Log in instead';
      case '/login':
        return 'Create an account';
      default:
        return 'Log in';
    }
  })();

  return (
    <>
      <header className="mb-16">
        <Container className="py-5 flex flex-col justify-center items-center md:flex-row md:justify-between">
          <Link href="/">
            <a className="logo-wrapper flex items-center">
              <div className="logo w-[40px] h-[37px] lg:w-[70px] lg:h-[67px] relative">
                <Image src={logo} layout="fill" alt="TaskSheet logo" />
              </div>
              <h3 className="text-3xl lg:text-[48px] font-bold text-main ml-2 lg:ml-8 select-none">
                TaskSheet
              </h3>
            </a>
          </Link>

          <div className="links mt-8 md:mt-0">
            <Link href="/login">
              <a className="flex items-center font-bold">
                <span className="mr-3">{linkText}</span>
                <Image
                  src={iconLogin}
                  alt="Login icon"
                  width="22px"
                  height="22px"
                />
              </a>
            </Link>
          </div>
        </Container>
      </header>

      {children}
    </>
  );
};

export default AuthLayout;
