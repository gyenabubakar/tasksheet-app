import Head from 'next/head';
import { useRouter } from 'next/router';
import { PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';

const WorkspaceRequestsPage: PageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Join Requests | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-id">
        <div className="body mt-16">Requests Page</div>
      </main>
    </>
  );
};

WorkspaceRequestsPage.layout = 'app';

WorkspaceRequestsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceRequestsPage;
