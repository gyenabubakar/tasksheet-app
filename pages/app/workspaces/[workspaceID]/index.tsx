import { useRouter } from 'next/router';
// import {} from 'react';
import Head from 'next/head';

import { FolderType, PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';
import Folder from '~/components/workspace/Folder';

const WorkspaceDetailsPage: PageWithLayout = () => {
  const router = useRouter();
  const folders: FolderType[] = [
    {
      id: '1',
      name: 'Mobile Apps',
      colour: '#5C68FF',
      category: {
        id: '1',
        name: 'Development',
      },
      tasks: { completed: 3, total: 8 },
    },
    {
      id: '2',
      name: '3D Animations',
      colour: '#14CC8A',
      category: {
        id: '2',
        name: 'Modelling, Colouring',
      },
      tasks: { completed: 9, total: 12 },
    },
    {
      id: '3',
      name: 'Blog Articles',
      colour: '#e11d48',
      category: {
        id: '3',
        name: 'Content Creation',
      },
      tasks: { completed: 3, total: 18 },
    },
  ];

  return (
    <>
      <Head>
        <title>Folders | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-id mt-8">
        <div className="body">
          <p className="text-darkgray font-medium">
            2 Folders and 7/10 completed tasks
          </p>

          <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {folders.map((folder) => (
              <Folder
                href={`/app/folders/${folder.id}`}
                key={folder.id}
                folder={folder}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

WorkspaceDetailsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceDetailsPage;
