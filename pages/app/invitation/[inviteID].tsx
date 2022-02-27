import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useState } from 'react';
import useSWR from 'swr';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

import { PageWithLayout } from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import subscriberIllustration from '~/assets/illustrations/subscriber.svg';
import voidIllustration from '~/assets/illustrations/void.svg';
import Button from '~/components/common/Button';
import swal from '~/assets/ts/sweetalert';
import notify from '~/assets/ts/notify';
import {
  InvitationModel,
  InviteAcceptedNotification,
  MemberJoinedNotification,
  NotificationType,
} from '~/assets/firebase/firebaseTypes';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';
import Loading from '~/components/common/Loading';
import ErrorFallback from '~/components/common/ErrorFallback';
import { getWorkspace } from '~/assets/fetchers/workspace';
import useUser from '~/hooks/useUser';
import pageTitleSuffix from '~/assets/pageTitleSuffix';

const WorkspaceInvitationActionPage: PageWithLayout = () => {
  const router = useRouter();
  const { inviteID } = router.query;
  const { user } = useUser();

  const [accepting, setAccepting] = useState(false);

  const { error, data: invite } = useSWR('get-invite-info', () => {
    return new Promise<InvitationModel>((resolve, reject) => {
      const inviteRef = doc(getFirestore(), `invitations`, inviteID as string);
      getDoc(inviteRef)
        .then((_doc) => {
          if (!_doc.exists()) {
            reject({
              title: 'Invitation not found.',
              message:
                'This invitation has probably been declined, accepted or expired.',
            });
          }

          resolve({
            id: _doc.id,
            ..._doc.data(),
          } as InvitationModel);
        })
        .catch((err) => {
          if (err) {
            reject({
              title: `Couldn't get invitation details.`,
              message: getDBErrorMessage(err),
            });
          }
        });
    });
  });

  function notifyMembers(members: string[]) {
    if (invite) {
      const db = getFirestore();
      const inviteRef = doc(db, 'invitations', invite.id as string);
      const batch = writeBatch(db);

      const senderNotifRef = doc(
        db,
        `users/${invite.sender.uid}`,
        `notifications`,
        uuid(),
      );

      batch.set(senderNotifRef, {
        type: NotificationType.WorkspaceInviteAccepted,
        readAt: null,
        message: `${user.displayName} has accepted your invite to join ${invite.workspace.name}.`,
        createdAt: serverTimestamp(),
        payload: {
          sender: {
            uid: user.uid,
            name: user.displayName,
            avatar: user.photoURL,
          },
          workspace: {
            id: invite.workspace.id,
            name: invite.workspace.name,
          },
        },
      } as InviteAcceptedNotification);

      members
        .filter((member) => member !== invite.sender.uid)
        .forEach((member) => {
          const memberNotifRef = doc(
            db,
            `users/${member}`,
            `notifications`,
            uuid(),
          );

          batch.set(memberNotifRef, {
            type: NotificationType.WorkspaceMemberJoined,
            readAt: null,
            message: `${user.displayName} has joined ${invite.workspace.name}.`,
            createdAt: serverTimestamp(),
            payload: {
              sender: {
                uid: user.uid,
                name: user.displayName,
                avatar: user.photoURL,
              },
              workspace: {
                id: invite.workspace.id,
                name: invite.workspace.name,
              },
            },
          } as MemberJoinedNotification);
        });

      batch.delete(inviteRef);

      batch.commit();
    }
  }

  async function onAcceptInvite() {
    if (!accepting && invite) {
      setAccepting(true);
      try {
        const workspaceRef = doc(
          getFirestore(),
          `workspaces`,
          invite.workspace.id,
        );

        const workspace = await getWorkspace(
          invite.workspace.id,
          user.uid,
          false,
        )();

        await updateDoc(workspaceRef, {
          members: [user.uid, ...workspace.members],
          updatedAt: serverTimestamp(),
        });

        notifyMembers(workspace.members);

        swal({
          icon: 'success',
          title: (
            <span>
              You&apos;re now a member of&nbsp;
              <span className="text-main">{workspace.name}</span>!<br />
              🎉🥳
            </span>
          ),
          timer: 3000,
          showConfirmButton: true,
        }).finally(async () => {
          setAccepting(false);
          await router.replace(`/app/workspaces/${workspace.id}`);
        });
      } catch (err: any) {
        if (err) {
          await swal({
            icon: 'error',
            title: `Failed accept invite.`,
            text: getDBErrorMessage(err),
          }).finally(() => router.replace('/app/notifications'));
        }
        setAccepting(false);
      }
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
        <title>
          Invitation{invite ? ` to join ${invite.workspace.name}` : ''}
          {pageTitleSuffix}
        </title>
      </Head>

      <Navigation />

      {!invite && !error && (
        <Loading loadingText="Loading workspace..." className="mt-12" />
      )}

      {error && !invite && (
        <ErrorFallback>
          <div className="w-56 h-56 mx-auto relative">
            <Image src={voidIllustration} layout="fill" />
          </div>

          <h1 className="text-xl md:text-2xl font-medium text-darkgray text-center mt-5">
            {error.title}
          </h1>

          <p className="text-gray-500 text-center mt-5 text-base md:text-lg">
            {error.message}
          </p>
        </ErrorFallback>
      )}

      {invite && !error && (
        <main className="mt-16">
          <div className="w-56 h-56 mx-auto relative">
            <Image src={subscriberIllustration} layout="fill" />
          </div>

          <h1 className="text-3xl font-bold text-center w-full md:w-8/12 lg:max-w-[60%] mx-auto mt-12">
            You&apos;ve been invited to join{' '}
            <span className="text-main">{invite.workspace.name}</span>.
          </h1>

          <div className="inviter mt-4 flex items-center justify-center">
            <div className="relative w-8 h-8 rounded-full bg-main ring-2 ring-white overflow-hidden">
              {invite.sender.avatar && (
                <Image src={invite.sender.avatar} layout="fill" />
              )}
            </div>

            <span className="font-medium text-darkgray ml-3">
              {' '}
              De Graft Arthur
            </span>
          </div>

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
        </main>
      )}
    </>
  );
};

WorkspaceInvitationActionPage.layout = 'app';

export default WorkspaceInvitationActionPage;
