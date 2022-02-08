import { useRouter } from 'next/router';
// import {} from 'react';
import Head from 'next/head';

import { PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';

const WorkspaceDetailsPage: PageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Folders | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-id">
        <div className="body mt-16">Folders</div>
      </main>
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

WorkspaceDetailsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceDetailsPage;
