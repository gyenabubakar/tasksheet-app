import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactTooltip from 'react-tooltip';

import iconArrowLeft from '~/assets/icons/arrow-left.svg';
import iconFolderAdd from '~/assets/icons/workspace/folder-add.svg';
import iconAddUser from '~/assets/icons/workspace/add-user.svg';
import iconShare from '~/assets/icons/workspace/share-orange.svg';
import iconSettings from '~/assets/icons/workspace/cog.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';
import swal from '~/assets/ts/sweetalert';

const WorkspaceDetailsLayout: React.FC = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { pathname } = router;
  const { workspaceID } = router.query;

  const isFoldersTab = pathname === '/app/workspaces/[workspaceID]';
  const isMembersTab = pathname === '/app/workspaces/[workspaceID]/members';
  const isRequestsTab = pathname === '/app/workspaces/[workspaceID]/requests';

  async function handleShareLink() {
    await swal({
      icon: 'warning',
      title:
        'Anyone with this link can issue a join request.<br /><br />Proceed?',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Yes, copy link!',
      async preConfirm(confirmed) {
        if (confirmed) {
          const workspaceLink = `${window.location.protocol}//${window.location.host}/invitation/${workspaceID}`;

          await window.navigator.clipboard.writeText(workspaceLink);
          await swal({
            icon: 'success',
            title: 'Link copied!',
            text: 'You can always pause receiving incoming join requests on the workspace settings page.',
          });
        }
      },
    });
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="workspace-heading">
        <div className="button-wrapper mb-10">
          <button onClick={() => router.back()}>
            <a>
              <Image src={iconArrowLeft} width="19px" height="14px" />
              <span className="inline-block ml-3 font-medium">Back</span>
            </a>
          </button>
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
                <span>Folders</span>
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
                className={`tab flex items-center text-base px-5 md:px-8 py-2 rounded-[12px] ${
                  isRequestsTab ? 'active' : ''
                }`}
              >
                <span>Join Requests</span>
                <span className="important ml-2" />
              </a>
            </Link>
          </div>

          <div className="workspace-actions-wrapper my-5">
            <button
              data-tip
              data-for="add-folder"
              onClick={() =>
                router.push(`/app/workspaces/${workspaceID}/new-folder`)
              }
            >
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

            <button
              data-tip
              data-for="add-member"
              onClick={() =>
                router.push(`/app/workspaces/${workspaceID}/invite`)
              }
            >
              <Image src={iconAddUser} width="30px" height="28px" />
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

            <button data-tip data-for="share-link" onClick={handleShareLink}>
              <Image src={iconShare} width="28px" height="28px" />
            </button>
            {isMounted && (
              <ReactTooltip
                id="share-link"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Share link
              </ReactTooltip>
            )}

            <button data-tip data-for="delete-workspace">
              <Image src={iconSettings} width="28px" height="28px" />
            </button>
            {isMounted && (
              <ReactTooltip
                id="delete-workspace"
                place="bottom"
                type="dark"
                effect="solid"
              >
                Workspace settings
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
