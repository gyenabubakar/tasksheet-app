import Head from 'next/head';
import { useRouter } from 'next/router';
import { PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';

const WorkspaceMembersPage: PageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Members | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-id">
        <div className="body mt-16">Members Page</div>
      </main>
    </>
  );
};

WorkspaceMembersPage.layout = 'app';

WorkspaceMembersPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceMembersPage;
