import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { MemberType, PageWithLayout } from '~/assets/ts/types';
import Member from '~/components/workspace/Member';
import WorkspaceDetailsHeader from '~/components/workspace/WorkspaceDetailsHeader';
import illustrationEmpty from '~/assets/illustrations/empty.svg';
import Button from '~/components/common/Button';
import useSWR from 'swr';
import { getMembers } from '~/assets/fetchers/workspace';
import useUser from '~/hooks/useUser';
import { Workspace, WorkspaceModel } from '~/assets/firebase/firebaseTypes';
import swal from '~/assets/ts/sweetalert';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import alertDBError from '~/assets/firebase/alertDBError';

interface WorkspaceSubpageProps {
  workspace: Workspace;
}

const WorkspaceMembersPage: PageWithLayout<WorkspaceSubpageProps> = ({
  workspace,
}) => {
  const router = useRouter();

  const { user } = useUser();
  const { error, data: members } = useSWR(
    `get-members-on-workspace-page-${workspace.id}`,
    getMembers(workspace.id!, user),
  );

  function onAssignTask(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onAssignTask:', member);
  }
  async function onDelete(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onDelete:', member);

    await swal({
      icon: 'warning',
      title: (
        <>
          Proceed removing&nbsp;
          <span className="font-bold text-main">{member.name}</span>?
        </>
      ),
      text: 'You would have to invite them again.',
      showConfirmButton: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Yes, remove!',
      preConfirm(confirmed: boolean): Promise<any> | null {
        if (!confirmed) {
          return null;
        }

        const db = getFirestore();
        const workspaceRef = doc(db, 'workspaces', workspace.id!);
        return updateDoc(workspaceRef, {
          members: members?.filter((m) => m.uid !== member.id),
        });
      },
    })
      .then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          await swal({
            icon: 'success',
            title: (
              <span>
                Deleted&nbsp;
                <span className="text-main">{member.name}</span>!
              </span>
            ),
          }).finally(() => window.location.reload());
        }
      })
      .catch((err) => {
        alertDBError(err, `Couldn't remove user.`);
      });
  }
  function onMakeAdmin(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onMakeAdmin:', member);
  }

  return (
    <>
      <Head>
        <title>Members | {workspace.name} · TaskSheet</title>
      </Head>

      {members && !error && (
        <main className="page-workspace-members mt-8">
          {members.length ? (
            <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map(({ email, avatar, displayName, uid }) => (
                <Member
                  key={uid}
                  member={{ id: uid, email, name: displayName, avatar }}
                  canModify={workspace.isAdmin || workspace.isOwner}
                  onAssignTask={(m) => onAssignTask(m)}
                  onDelete={(m) => onDelete(m)}
                  onMakeAdmin={(m) => onMakeAdmin(m)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state flex flex-col justify-center items-center mt-24">
              <div className="w-[247px] h-[241px] relative">
                <Image src={illustrationEmpty} priority />
              </div>

              <h3 className="font-bold text-[24px] mt-10">
                You’re alone in this workspace. 😔
              </h3>

              <div className="mt-10">
                <Button
                  paddingClasses="px-8 py-6"
                  onClick={() =>
                    router.push(`/app/workspaces/${workspace.id}/invite`)
                  }
                >
                  Invite New Members
                </Button>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
};

WorkspaceMembersPage.layout = 'app';

WorkspaceMembersPage.SecondaryLayout = WorkspaceDetailsHeader;

export default WorkspaceMembersPage;
