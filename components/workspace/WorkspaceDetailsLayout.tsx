import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactTooltip from 'react-tooltip';

import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import iconFolderAdd from '~/assets/icons/workspace/folder-add.svg';
import iconPeople from '~/assets/icons/workspace/people.svg';
import iconLogout from '~/assets/icons/workspace/logout.svg';
import iconBin from '~/assets/icons/workspace/bin.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';

const WorkspaceDetailsLayout: React.FC = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { pathname } = router;
  const { workspaceID } = router.query;

  const isFoldersTab = pathname === '/app/workspaces/[workspaceID]';
  const isMembersTab = pathname === '/app/workspaces/[workspaceID]/members';
  const isRequestsTab = pathname === '/app/workspaces/[workspaceID]/requests';

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(router.pathname);

    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="workspace-heading">
        <div className="button-wrapper mb-10">
          <Link href="/app/workspaces/">
            <a>
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">Workspaces</span>
            </a>
          </Link>
        </div>

        <div className="workspace-info flex flex-col-reverse justify-between items-center lg:justify-start lg:items-start lg:grid grid-cols-12">
          <div className="div col-span-8">
            <h1 className="font-bold text-4xl md:text-[48px] md:text-center lg:text-left">
              Montreal Projects
            </h1>

            <p className="mt-5 text-darkgray md:text-center lg:text-left">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos iusto quibusdam nam eaque enim eum officia quam
              perspiciatis nisi impedit a commodi pariatur obcaecati dolores
              facere, reprehenderit esse saepe doloremque?
            </p>
          </div>

          <div className="cover-wrapper w-full mb-5 lg:mb-0 col-start-10 col-span-3">
            <div className="cover w-full h-56 md:w-8/12 md:h-72 md:mx-auto lg:mx-0 lg:w-72 lg:h-40 relative">
              <Image
                src="/images/macbook.jpeg"
                layout="fill"
                className="rounded-md"
              />
            </div>
            <div className="text-center">
              <button className="my-2 font-medium text-main hover:text-darkmain">
                Change
              </button>
            </div>
          </div>
        </div>

        <div className="nav flex flex-col md:flex-row justify-between items-center pt-12">
          <div className="tabs font-medium flex items-center bg-[#EAEBFF] px-1.5 py-1.5 rounded-[12px]">
            <Link href={`/app/workspaces/${workspaceID}`}>
              <a
                className={`tab text-base px-5 md:px-8 py-2 rounded-[12px] ${
                  isFoldersTab ? 'active' : ''
                }`}
              >
                Folders
              </a>
            </Link>

            <Link href={`/app/workspaces/${workspaceID}/members`}>
              <a
                className={`tab text-base px-5 md:px-8 py-2 rounded-[12px] ${
                  isMembersTab ? 'active' : ''
                }`}
              >
                Members
              </a>
            </Link>

            <Link href={`/app/workspaces/${workspaceID}/requests`}>
              <a
                className={`tab text-base px-5 md:px-8 py-2 rounded-[12px] ${
                  isRequestsTab ? 'active' : ''
                }`}
              >
                Join Requests
              </a>
            </Link>
          </div>

          <div className="workspace-actions-wrapper my-5">
            <button data-tip data-for="add-folder">
              <Image src={iconFolderAdd} />
            </button>
            {isMounted && (
              <ReactTooltip
                id="add-folder"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Create new folder
              </ReactTooltip>
            )}

            <button data-tip data-for="add-member">
              <Image src={iconPeople} />
            </button>
            {isMounted && (
              <ReactTooltip
                id="add-member"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Invite new members
              </ReactTooltip>
            )}

            <button data-tip data-for="leave-workspace">
              <Image src={iconLogout} />
            </button>
            {isMounted && (
              <ReactTooltip
                id="leave-workspace"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Leave workspace
              </ReactTooltip>
            )}

            <button data-tip data-for="delete-workspace">
              <Image src={iconBin} />
            </button>
            {isMounted && (
              <ReactTooltip
                id="delete-workspace"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Delete Workspace
              </ReactTooltip>
            )}
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default WorkspaceDetailsLayout;
