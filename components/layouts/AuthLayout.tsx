import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Container from '~/components/common/Container';
import logo from '~/assets/images/logo.svg';
import iconLogin from '~/assets/icons/login.svg';

const AuthLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const link = (() => {
    switch (router.route) {
      case '/signup':
        return { text: 'Log in instead', route: '/login' };
      case '/login':
        return { text: 'Create new account', route: '/signup' };
      default:
        return { text: 'Log in', route: '/login' };
    }
  })();

  return (
    <>
      <header className="mb-16">
        <Container className="py-5 flex flex-col justify-center items-center md:flex-row md:justify-between">
          <Link href="/">
            <a className="logo-wrapper flex items-center">
              <div className="logo w-[40px] h-[37px] relative">
                <Image src={logo} layout="fill" alt="TaskSheet logo" />
              </div>
              <h3 className="text-3xl font-bold text-main ml-2 select-none">
                TaskSheet
              </h3>
            </a>
          </Link>

          {router.route !== '/verify' && (
            <div className="links mt-8 md:mt-0">
              <Link href={link.route}>
                <a className="flex items-center font-bold">
                  <span className="mr-3">{link.text}</span>
                  <Image
                    src={iconLogin}
                    alt="Login icon"
                    width="22px"
                    height="22px"
                  />
                </a>
              </Link>
            </div>
          )}
        </Container>
      </header>

      {children}
    </>
  );
};

export default AuthLayout;
