import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { PageWithLayout, RequestType } from '~/assets/ts/types';
import Request from '~/components/workspace/Request';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';
import illustrationEmpty from '~/assets/illustrations/empty.svg';
import Button from '~/components/common/Button';
import iconShare from '~/assets/icons/workspace/share.svg';
import swal from '~/assets/ts/sweetalert';

const WorkspaceRequestsPage: PageWithLayout = () => {
  const router = useRouter();

  const { workspaceID } = router.query;

  const requests: RequestType[] = [
    // {
    //   id: '1',
    //   user: {
    //     id: '1',
    //     name: 'De Graft Athur',
    //     email: 'degraft@gmail.com',
    //     avatar:
    //       'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    //   },
    // },
    // {
    //   id: '2',
    //   user: {
    //     id: '1',
    //     name: 'De Graft Athur',
    //     email: 'degraft@gmail.com',
    //     avatar:
    //       'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    //   },
    // },
  ];

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
        <p className="text-darkgray font-medium">1 pending request</p>

        {requests.length ? (
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
        ) : (
          <div className="empt-state flex flex-col justify-center items-center mt-24">
            <div className="w-[247px] h-[241px] relative">
              <Image src={illustrationEmpty} />
            </div>

            <h3 className="font-bold text-center text-[24px] mt-10">
              There are no join requests at this time.
            </h3>

            <p className="text-center w-11/12 md:w-8/12 mx-auto text-darkgray mt-5">
              You can share your public link to allow anyone to send join
              requests to this workspace.
            </p>

            <div className="mt-10">
              <Button
                className="px-8 py-6"
                icon={<Image src={iconShare} width="27px" height="27px" />}
                onClick={() => handleShareLink()}
              >
                <span className="ml-8">Share Link</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

WorkspaceRequestsPage.layout = 'app';

WorkspaceRequestsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceRequestsPage;
