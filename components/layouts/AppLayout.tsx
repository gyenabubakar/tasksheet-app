import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getAuth, signOut } from 'firebase/auth';

import logo from '~/assets/images/logo.svg';
import iconPlus from '~/assets/icons/nav/plus-white.svg';
import iconMenu from '~/assets/icons/nav/menu.svg';
import iconEdit from '~/assets/icons/task/edit.svg';
import Button from '~/components/common/Button';
import Container from '~/components/common/Container';
import iconUser from '~/assets/icons/nav/user.svg';
import iconLogout from '~/assets/icons/nav/logout.svg';
import iconPeople from '~/assets/icons/nav/people.svg';
import iconPeopleColoured from '~/assets/icons/nav/people-coloured.svg';
import LoadingOverlay from '~/components/misc/LoadingOverlay';
import cookies from '~/assets/ts/cookies';
import useUser from '~/hooks/useUser';

const floatingButtonBlockedPaths = [
  '/app/new-task',
  '/app/workspaces/new',
  '/app/workspaces/[workspaceID]/invite',
  '/app/workspaces/[workspaceID]/settings',
  '/app/workspaces/[workspaceID]/new-folder',
  '/app/invitation/[inviteID]',
  '/app/folder/[folderID]/edit',
  '/app/workspaces/new-workspace',
];

const AppLayout: React.FC = ({ children }) => {
  const { user } = useUser();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [logout, setLogout] = useState(false);

  const router = useRouter();
  const isHomePage = /^\/app(\/)?$/.test(router.route);
  const isWorkspacesPage = /^\/app\/workspaces(\/)?$/.test(router.route);
  const isNotificationsPage = /^\/app\/notifications(\/)?$/.test(router.route);

  const pathIsBlocked = floatingButtonBlockedPaths.includes(router.pathname);
  const isTaskDetailsPage = router.pathname === '/app/task/[taskID]';

  async function handleLogout() {
    const auth = getAuth();
    cookies.removeAll();
    await signOut(auth);
    await router.push('/login');
  }

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

  function handleClickedOutsideMobileMenu(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const menu = document.querySelector(
      '#mobile-menu-wrapper',
    ) as HTMLDivElement;

    if (target.id !== 'mobile-menu-wrapper' && menu && !menu.contains(target)) {
      setShowMobileMenu(false);
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

  useEffect(() => {
    if (showMobileMenu) {
      document.addEventListener('click', handleClickedOutsideMobileMenu);
    } else {
      document.removeEventListener('click', handleClickedOutsideMobileMenu);
    }

    return () => {
      document.removeEventListener('click', handleClickedOutsideMobileMenu);
    };
  }, [showMobileMenu]);

  return (
    <div className="app-layout relative h-screen w-screen overflow-x-hidden">
      <nav className="fixed w-full right-0 top-0 left-0 z-30">
        <Container className="flex justify-between items-center">
          <div
            className="mobile-menu-wrapper block lg:hidden relative"
            id="mobile-menu-wrapper"
          >
            <button
              className="lg:hidden logo w-[40px] h-[37px] relative"
              onClick={() => setShowMobileMenu((prevState) => !prevState)}
            >
              <Image src={iconMenu} layout="fill" alt="Menu" />
            </button>

            {showMobileMenu && (
              <div
                id="user-options-wrapper"
                className="user-options-wrapper absolute bg-white rounded-small min-w-[300px] left-0 top-14 cursor-default overflow-hidden shadow-2xl shadow-faintmain"
              >
                <ul>
                  <li
                    className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center"
                    onClick={async () => {
                      await router.push('/app/');
                      setShowMobileMenu(false);
                    }}
                  >
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.8593 6.36985L12.9293 0.829849C11.8593 -0.0301508 10.1293 -0.0301508 9.06929 0.819849L2.13929 6.36985C1.35929 6.98985 0.859288 8.29985 1.02929 9.27985L2.35929 17.2398C2.59929 18.6598 3.95929 19.8098 5.39929 19.8098H16.5993C18.0293 19.8098 19.3993 18.6498 19.6393 17.2398L20.9693 9.27985C21.1293 8.29985 20.6293 6.98985 19.8593 6.36985ZM10.9993 13.4998C9.61929 13.4998 8.49929 12.3798 8.49929 10.9998C8.49929 9.61985 9.61929 8.49985 10.9993 8.49985C12.3793 8.49985 13.4993 9.61985 13.4993 10.9998C13.4993 12.3798 12.3793 13.4998 10.9993 13.4998Z"
                        fill={`${isHomePage ? '#5c68ff' : '#121212'}`}
                      />
                    </svg>

                    <span
                      className={`font-medium text-darkgray inline-block ml-3 text-base ${
                        isHomePage ? 'text-main' : ''
                      }`}
                    >
                      Home
                    </span>
                  </li>

                  <li
                    className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center"
                    onClick={async () => {
                      await router.push('/app/workspaces');
                      setShowMobileMenu(false);
                    }}
                  >
                    {!isWorkspacesPage && <Image src={iconPeople} />}
                    {isWorkspacesPage && <Image src={iconPeopleColoured} />}

                    <span
                      className={`font-medium text-darkgray inline-block ml-3 text-darkgray text-base ${
                        isWorkspacesPage ? 'text-main' : ''
                      }`}
                    >
                      Workspaces
                    </span>
                  </li>

                  <li
                    className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center"
                    onClick={async () => {
                      await router.push('/app/notifications');
                      setShowMobileMenu(false);
                    }}
                  >
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.1892 12.0608L16.0592 10.1808C15.8092 9.77078 15.5892 8.98078 15.5892 8.50078V6.63078C15.5892 3.00078 12.6392 0.0507812 9.01923 0.0507812C5.38923 0.0607812 2.43923 3.00078 2.43923 6.63078V8.49078C2.43923 8.97078 2.21923 9.76078 1.97923 10.1708L0.849226 12.0508C0.419226 12.7808 0.319226 13.6108 0.589226 14.3308C0.859226 15.0608 1.46923 15.6408 2.26923 15.9008C3.34923 16.2608 4.43923 16.5208 5.54923 16.7108C5.65923 16.7308 5.76923 16.7408 5.87923 16.7608C6.01923 16.7808 6.16923 16.8008 6.31923 16.8208C6.57923 16.8608 6.83923 16.8908 7.10923 16.9108C7.73923 16.9708 8.37923 17.0008 9.01923 17.0008C9.64923 17.0008 10.2792 16.9708 10.8992 16.9108C11.1292 16.8908 11.3592 16.8708 11.5792 16.8408C11.7592 16.8208 11.9392 16.8008 12.1192 16.7708C12.2292 16.7608 12.3392 16.7408 12.4492 16.7208C13.5692 16.5408 14.6792 16.2608 15.7592 15.9008C16.5292 15.6408 17.1192 15.0608 17.3992 14.3208C17.6792 13.5708 17.5992 12.7508 17.1892 12.0608ZM9.74923 8.00078C9.74923 8.42078 9.40923 8.76078 8.98923 8.76078C8.56923 8.76078 8.22923 8.42078 8.22923 8.00078V4.90078C8.22923 4.48078 8.56923 4.14078 8.98923 4.14078C9.40923 4.14078 9.74923 4.48078 9.74923 4.90078V8.00078Z"
                        fill={`${isNotificationsPage ? '#5c68ff' : '#121212'}`}
                      />
                      <path
                        d="M11.8297 18.01C11.4097 19.17 10.2997 20 8.99969 20C8.20969 20 7.42969 19.68 6.87969 19.11C6.55969 18.81 6.31969 18.41 6.17969 18C6.30969 18.02 6.43969 18.03 6.57969 18.05C6.80969 18.08 7.04969 18.11 7.28969 18.13C7.85969 18.18 8.43969 18.21 9.01969 18.21C9.58969 18.21 10.1597 18.18 10.7197 18.13C10.9297 18.11 11.1397 18.1 11.3397 18.07C11.4997 18.05 11.6597 18.03 11.8297 18.01Z"
                        fill={`${isNotificationsPage ? '#5c68ff' : '#121212'}`}
                      />
                    </svg>

                    <span className="font-medium text-darkgray inline-block ml-3 text-darkgray text-base">
                      Notifications
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

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
                  <p className="text-main font-bold">{user.displayName}</p>
                  <p className="text-darkgray font-medium text-sm">
                    {user.email}
                  </p>
                </div>

                <ul className="">
                  <li
                    className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center"
                    onClick={async () => {
                      await router.push('/app/profile/settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <Image src={iconUser} />
                    <span className="font-medium text-darkgray inline-block ml-3 text-base">
                      Profile settings
                    </span>
                  </li>

                  <li
                    className="px-5 py-2.5 cursor-pointer hover:bg-faintmain flex items-center"
                    onClick={() => {
                      setLogout(true);
                      setShowUserMenu(false);
                    }}
                  >
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

      {logout && (
        <LoadingOverlay
          loadingText="Logging out..."
          performTask={async () => handleLogout()}
        />
      )}
    </div>
  );
};

export default AppLayout;
