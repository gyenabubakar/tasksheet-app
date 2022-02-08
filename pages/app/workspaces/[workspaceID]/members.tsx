import Head from 'next/head';
import { useRouter } from 'next/router';
import { MemberType, PageWithLayout } from '~/assets/ts/types';
import Member from '~/components/workspace/Member';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';

const WorkspaceMembersPage: PageWithLayout = () => {
  const router = useRouter();

  const members: MemberType[] = [
    {
      id: '1',
      name: 'De Graft Athur',
      role: 'UI/UX Designer',
      avatar:
        'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      tasks: {
        completed: 10,
        total: 12,
      },
    },
    {
      id: '2',
      name: 'De Graft Athur',
      role: 'UI/UX Designer',
      avatar:
        'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      tasks: {
        completed: 10,
        total: 12,
      },
    },
    {
      id: '3',
      name: 'De Graft Athur',
      role: 'UI/UX Designer',
      avatar:
        'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      tasks: {
        completed: 10,
        total: 12,
      },
    },
  ];

  function onAssignTask(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onAssignTask:', member);
  }
  function onDelete(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onDelete:', member);
  }
  function onMakeAdmin(member: MemberType) {
    // eslint-disable-next-line no-console
    console.log('onMakeAdmin:', member);
  }

  return (
    <>
      <Head>
        <title>Members | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-members mt-8">
        <p className="text-darkgray font-medium">1 member</p>

        <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((member) => (
            <Member
              key={member.id}
              member={member}
              onAssignTask={(m) => onAssignTask(m)}
              onDelete={(m) => onDelete(m)}
              onMakeAdmin={(m) => onMakeAdmin(m)}
            />
          ))}
        </div>
      </main>
    </>
  );
};

WorkspaceMembersPage.layout = 'app';

WorkspaceMembersPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceMembersPage;
