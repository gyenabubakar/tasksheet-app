import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useState } from 'react';

import { PageWithLayout } from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import subscriberIllustration from '~/assets/illustrations/subscriber.svg';
import voidIllustration from '~/assets/illustrations/void.svg';
import Button from '~/components/common/Button';
import swal from '~/assets/ts/sweetalert';
import notify from '~/assets/ts/notify';

const WorkspaceInvitationActionPage: PageWithLayout = () => {
  const [accepting, setAccepting] = useState(false);

  const router = useRouter();
  const { inviteID } = router.query;

  const expiredOrDeclined = true;

  function onAcceptInvite() {
    if (!accepting) {
      setAccepting(true);
      setTimeout(() => {
        swal({
          icon: 'success',
          title: (
            <span>
              You&apos;re now a member of{' '}
              <span className="text-main">Workspace Name</span>! <br />
              🎉🥳
            </span>
          ),
          timer: 3000,
          showConfirmButton: true,
        }).finally(async () => {
          await router.replace('/app/workspaces/1');
        });
      }, 2000);
    }
  }

  async function onDeclineInvite() {
    // eslint-disable-next-line no-console
    await router.replace('/app/');

    setTimeout(() => {
      notify('Declined invite successfully!', {
        type: 'success',
      });
    }, 1500);
  }

  return (
    <>
      <Head>
        <title>Invitation to join {inviteID} · TaskSheet</title>
      </Head>

      <Navigation />

      <main className="mt-16">
        <div className="w-56 h-56 mx-auto relative">
          <Image
            src={!expiredOrDeclined ? subscriberIllustration : voidIllustration}
            layout="fill"
          />
        </div>

        <h1 className="text-3xl font-bold text-center w-full md:w-8/12 lg:max-w-[60%] mx-auto mt-12">
          {!expiredOrDeclined ? (
            <span>
              You & apos;ve been invited to join{' '}
              <span className="text-main">Workspace Name</span>.
            </span>
          ) : (
            <span>This invitation has probably been declined or expired.</span>
          )}
        </h1>

        {!expiredOrDeclined && (
          <div className="inviter mt-4 flex items-center justify-center">
            <div className="relative w-8 h-8 rounded-full ring-2 ring-white overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                layout="fill"
              />
            </div>

            <span className="font-medium text-darkgray ml-3">
              {' '}
              De Graft Arthur
            </span>
          </div>
        )}

        {!expiredOrDeclined && (
          <div className="actions mt-16 flex flex-col md:flex-row items-center justify-center">
            <div className="accept-wrapper">
              <Button
                loading={accepting}
                disabled={accepting}
                onClick={() => onAcceptInvite()}
              >
                {accepting ? 'On it...' : 'Accept'}
              </Button>
            </div>

            <div className="decline-wrapper">
              <button
                className="mt-3 md:mt-0 md:ml-3 text-red-500 px-20 py-4 rounded-small border-2 border-red-500 hover:bg-red-500 hover:text-white font-medium"
                onClick={() => onDeclineInvite()}
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

WorkspaceInvitationActionPage.layout = 'app';

export default WorkspaceInvitationActionPage;
