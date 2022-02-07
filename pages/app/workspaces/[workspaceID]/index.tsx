import { PageWithLayout } from '~/assets/ts/types';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

const WorkspaceDetailsPage: PageWithLayout = (props) => {
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(props);
  }, [router]);

  return (
    <>
      <Head>
        <title>Workspace ID · TaskSheet</title>
      </Head>

      <main>
        <h1>Workspace ID - {router.query.workspaceID}</h1>
        <button onClick={() => router.push('/app/workspaces/2')}>
          Go to two
        </button>
      </main>
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

export default WorkspaceDetailsPage;
