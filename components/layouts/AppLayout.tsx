import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

import logo from '~/assets/images/logo.svg';
import iconPlus from '~/assets/icons/nav/plus-white.svg';
import iconMenu from '~/assets/icons/nav/menu.svg';
import iconEdit from '~/assets/icons/task/edit.svg';
import Button from '~/components/common/Button';
import Container from '~/components/common/Container';
import iconUser from '~/assets/icons/nav/user.svg';
import iconLogout from '~/assets/icons/nav/logout.svg';

const floatingButtonBlockedPaths = [
  '/app/new-task',
  '/app/workspaces/new',
  '/app/workspaces/[workspaceID]/invite',
  '/app/workspaces/[workspaceID]/settings',
  '/app/workspaces/[workspaceID]/new-folder',
  '/app/invitation/[inviteID]',
];

const AppLayout: React.FC = ({ children }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const isHomePage = /^\/app(\/)?$/.test(router.route);
  const isWorkspacesPage = /^\/app\/workspaces(\/)?$/.test(router.route);
  const isNotificationsPage = /^\/app\/notifications(\/)?$/.test(router.route);

  const pathIsBlocked = floatingButtonBlockedPaths.includes(router.pathname);
  const isTaskDetailsPage = router.pathname === '/app/task/[taskID]';

  async function handleFloatingButtonClick() {
    if (!pathIsBlocked) {
      if (isTaskDetailsPage) {
        const { taskID } = router.query;
        await router.push(`/app/task/${taskID}/edit`);
        return;
      }

      await router.push(`/app/new-task`);
    }
  }

  function handleClickedOutsideUserMenu(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const menu = document.querySelector(
      '#user-options-wrapper',
    ) as HTMLDivElement;

    if (
      target.id !== 'user-options-wrapper' &&
      menu &&
      !menu.contains(target)
    ) {
      setShowUserMenu(false);
    }
  }

  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('click', handleClickedOutsideUserMenu);
    } else {
      document.removeEventListener('click', handleClickedOutsideUserMenu);
    }

    return () => {
      document.removeEventListener('click', handleClickedOutsideUserMenu);
    };
  }, [showUserMenu]);

  return (
    <div className="app-layout relative h-screen w-screen overflow-x-hidden">
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
              <a
                className={`link-item ${
                  isNotificationsPage ? 'exact-active' : ''
                }`}
              >
                Notifications
              </a>
            </Link>
          </div>

          <div className="flex relative">
            <div
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-main cursor-pointer my-3 lg:my-0"
              onClick={() => setShowUserMenu((prevState) => !prevState)}
            />

            {showUserMenu && (
              <div
                id="user-options-wrapper"
                className="user-options-wrapper absolute bg-white rounded-small min-w-[300px] right-0 top-14 cursor-default overflow-hidden shadow-2xl shadow-faintmain"
              >
                <div className="px-5 py-3">
                  <p className="text-main font-bold">Gyen Abubakar</p>
                  <p className="text-darkgray font-medium text-sm">
                    indehyde@gmail.com
                  </p>
                </div>

                <ul className="">
                  <li className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center">
                    <Image src={iconUser} />
                    <span className="font-medium text-darkgray inline-block ml-3 text-base">
                      Profile settings
                    </span>
                  </li>

                  <li className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center">
                    <Image src={iconLogout} />
                    <span className="font-medium text-darkgray inline-block ml-3 text-red-500 text-base">
                      Log out
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </Container>
      </nav>

      <Container className="mt-[4.42rem] pt-8 md:pt-12 pb-20 md:pb-96">
        {children}
      </Container>

      {!pathIsBlocked && (
        <div className="w-full flex justify-end fixed bottom-5 lg:bottom-12">
          <Container className="flex justify-end">
            <Button
              className="px-4 md:px-10 flex items-center rounded-full"
              onClick={() => handleFloatingButtonClick()}
            >
              {router.pathname === '/app/task/[taskID]' && (
                <Image src={iconEdit} width="23px" height="23px" priority />
              )}
              {router.pathname !== '/app/task/[taskID]' && (
                <Image src={iconPlus} width="23px" height="23px" priority />
              )}

              <span className="ml-5 hidden md:inline">
                {router.pathname === '/app/task/[taskID]'
                  ? 'Edit task'
                  : 'Create task'}
              </span>
            </Button>
          </Container>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
