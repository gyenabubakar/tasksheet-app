import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

import logo from '~/assets/images/logo.svg';
import iconPlus from '~/assets/icons/nav/plus-white.svg';
import iconMenu from '~/assets/icons/nav/menu.svg';
import Button from '~/components/common/Button';
import Container from '~/components/common/Container';

const AppLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const isHomePage = /^\/app(\/)?$/.test(router.route);
  const isWorkspacesPage = /^\/app\/workspaces(\/)?$/.test(router.route);
  const isNotifsPage = /^\/app\/notifications(\/)?$/.test(router.route);

  return (
    <div className="relative h-screen w-screen overflow-x-hidden">
      <nav className="fixed w-full right-0 top-0 left-0 z-30">
        <Container className="flex justify-between items-center">
          <button className="lg:hidden logo w-[40px] h-[37px] relative">
            <Image src={iconMenu} layout="fill" alt="Menu" />
          </button>

          <Link href="/app/">
            <a className="flex logo-wrapper items-center justify-center">
              <div className="logo w-[40px] h-[37px] relative">
                <Image src={logo} layout="fill" alt="TaskSheet logo" />
              </div>
              <h3 className="hidden md:block text-3xl font-bold text-main ml-2 select-none">
                TaskSheet
              </h3>
            </a>
          </Link>

          <div className="nav-links hidden lg:flex">
            <Link href="/app/">
              <a className={`link-item ${isHomePage ? 'exact-active' : ''}`}>
                Home
              </a>
            </Link>

            <Link href="/app/workspaces">
              <a
                className={`link-item ${
                  isWorkspacesPage ? 'exact-active' : ''
                }`}
              >
                Workspaces
              </a>
            </Link>

            <Link href="/app/notifications">
              <a className={`link-item ${isNotifsPage ? 'exact-active' : ''}`}>
                Notifications
              </a>
            </Link>
          </div>

          <div className="flex">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-main cursor-pointer my-3 lg:my-0" />
          </div>
        </Container>
      </nav>

      <Container className="mt-[4.42rem] pt-8 md:pt-12">{children}</Container>

      <div className="w-full fixed bottom-5 lg:bottom-12">
        <Button className="rounded-full px-4 md:px-10 flex items-center">
          <Image src={iconPlus} width="23px" height="23px" />
          <span className="ml-5 hidden md:inline">Create Task</span>
        </Button>
      </div>
    </div>
  );
};

export default AppLayout;
