import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

import { WorkspaceCardInfo, PageWithLayout } from '~/assets/ts/types';
import Workspace from '~/components/workspace/Workspace';
import illustrationEmpty from '~/assets/illustrations/empty.svg';

const WorkspacesHomePage: PageWithLayout = () => {
  const workspaces: WorkspaceCardInfo[] = [
    // {
    //   id: '1',
    //   name: 'React Projects',
    //   description:
    //     'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos quasi dicta, id iure pariatur, eveniet reprehenderit cupiditate voluptas ipsa aperiam nostrum voluptate reiciendis! Nisi incidunt consequuntur quae, minus cumque molestias!',
    //   foldersCount: 5,
    //   membersCount: 13,
    //   tasksCount: 36,
    // },
    // {
    //   id: '2',
    //   name: 'Vue Front-ends',
    //   description:
    //     'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos quasi dicta, id iure pariatur, eveniet reprehenderit cupiditate voluptas ipsa aperiam nostrum voluptate reiciendis! Nisi incidunt consequuntur quae, minus cumque molestias!',
    //   foldersCount: 2,
    //   membersCount: 3,
    //   tasksCount: 11,
    // },
    // {
    //   id: '3',
    //   name: 'Firebase Integration',
    //   description:
    //     'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eos quasi dicta, id iure pariatur, eveniet reprehenderit cupiditate voluptas ipsa aperiam nostrum voluptate reiciendis! Nisi incidunt consequuntur quae, minus cumque molestias!',
    //   foldersCount: 12,
    //   membersCount: 34,
    //   tasksCount: 101,
    // },
  ];

  return (
    <>
      <Head>
        <title>Your Workspaces · TaskSheet</title>
      </Head>

      <main>
        <div className="header flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl md:text-[36px] font-bold">
            Your Workspaces
          </h1>

          <Link href="/app/workspaces/new-workspace">
            <a className="px-5 md:px-8 py-3 rounded-small text-sm md:text-[18px] text-white bg-main hover:bg-darkmain">
              New Workspace
            </a>
          </Link>
        </div>

        {workspaces.length ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workspaces.map((workspace) => (
              <div key={workspace.id}>
                <Workspace workspace={workspace} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-28">
            <Image src={illustrationEmpty} />

            <h3 className="font-bold text-[24px] mt-10">
              You&apos;re not part of any workspace.
            </h3>

            <p className="mt-5 text-darkgray md:max-w-[600px] mx-auto">
              Workspaces are like containers for organising your projects.{' '}
              <br className="hidden md:block" /> You can be invited into
              workspaces, join with a shared link or create one yourself.
            </p>

            <div className="text-center mt-12">
              <Link href="/app/workspaces/new-workspace">
                <a className="px-5 md:px-8 py-3 rounded-small text-sm md:text-[18px] text-white bg-main hover:bg-darkmain">
                  New Workspace
                </a>
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

WorkspacesHomePage.layout = 'app';

export default WorkspacesHomePage;
