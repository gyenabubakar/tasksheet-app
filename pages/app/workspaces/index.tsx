import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import useSWR from 'swr';

import { PageWithLayout, WorkspaceCardInfo } from '~/assets/ts/types';
import Workspace from '~/components/workspace/Workspace';
import illustrationEmpty from '~/assets/illustrations/empty.svg';
import { getWorkspaces } from '~/assets/fetchers/workspace';
import useUser from '~/hooks/useUser';
import Loading from '~/components/common/Loading';
import ErrorFallback from '~/components/common/ErrorFallback';

const WorkspacesHomePage: PageWithLayout = () => {
  const { user } = useUser();
  const { error, data: workspaces } = useSWR(
    'get-user-workspaces-on-page',
    getWorkspaces(user.uid),
  );

  return (
    <>
      <Head>
        <title>Your Workspaces · TaskSheet</title>
      </Head>

      {!workspaces && !error && (
        <Loading loadingText="Getting your workspaces..." className="mt-12" />
      )}

      {error && !workspaces && (
        <ErrorFallback title={error.title} message={error.message} />
      )}

      {workspaces && !error && (
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
              {workspaces.map(({ id, name, description }) => (
                <div key={id}>
                  <Workspace workspace={{ id: id!, name, description }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-28">
              <Image src={illustrationEmpty} priority />

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
      )}
    </>
  );
};

WorkspacesHomePage.layout = 'app';

export default WorkspacesHomePage;
