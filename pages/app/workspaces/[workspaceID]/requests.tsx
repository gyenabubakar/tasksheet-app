import Head from 'next/head';
import { useRouter } from 'next/router';
import { PageWithLayout, RequestType } from '~/assets/ts/types';
import Request from '~/components/workspace/Request';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';

const WorkspaceRequestsPage: PageWithLayout = () => {
  const router = useRouter();

  const requests: RequestType[] = [
    {
      id: '1',
      user: {
        id: '1',
        name: 'De Graft Athur',
        email: 'degraft@gmail.com',
        avatar:
          'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      },
    },
    {
      id: '2',
      user: {
        id: '1',
        name: 'De Graft Athur',
        email: 'degraft@gmail.com',
        avatar:
          'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      },
    },
  ];

  function onAccept(request: RequestType) {
    // eslint-disable-next-line no-console
    return new Promise<null>((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(request);
        resolve(null);
      }, 2000);
    });
  }

  function onReject(request: RequestType) {
    // eslint-disable-next-line no-console
    console.log(request);
  }

  return (
    <>
      <Head>
        <title>Join Requests | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-requests mt-8">
        <p className="text-darkgray font-medium">1 member</p>

        <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {requests.map((request) => (
            <Request
              key={request.id}
              request={request}
              onAccept={(r) => onAccept(r)}
              onReject={(r) => onReject(r)}
            />
          ))}
        </div>
      </main>
    </>
  );
};

WorkspaceRequestsPage.layout = 'app';

WorkspaceRequestsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceRequestsPage;
