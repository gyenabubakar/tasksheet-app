import { useRouter } from 'next/router';
import Head from 'next/head';

import { FolderType, PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsLayout from '~/components/workspace/WorkspaceDetailsLayout';
import Folder from '~/components/workspace/Folder';
import swal from '~/assets/ts/sweetalert';

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

  function onEditFolder(folder: FolderType) {
    console.log('edit:', folder);
  }

  async function onDeleteFolder(folder: FolderType) {
    await swal({
      icon: 'warning',
      title: (
        <>
          Proceed deleting{' '}
          <span className="font-bold text-main">{folder.name}</span>?
        </>
      ),
      text: "You can't undo this.",
      showConfirmButton: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonText: 'Yes, delete',
      preConfirm(confirmed: boolean): Promise<null> | null {
        if (!confirmed) {
          return null;
        }

        return new Promise<null>((resolve) => {
          setTimeout(() => {
            console.log('delete:', folder);
            resolve(null);
          }, 3000);
        });
      },
    });
  }

  return (
    <>
      <Head>
        <title>Folders | {router.query.workspaceID} · TaskSheet</title>
      </Head>

      <main className="page-workspace-folders mt-8">
        <p className="text-darkgray font-medium">
          2 Folders and 7/10 completed tasks
        </p>

        <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {folders.map((folder) => (
            <Folder
              href={`/app/folders/${folder.id}`}
              key={folder.id}
              folder={folder}
              onEdit={(f) => onEditFolder(f)}
              onDelete={(f) => onDeleteFolder(f)}
            />
          ))}
        </div>
      </main>
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

WorkspaceDetailsPage.SecondaryLayout = WorkspaceDetailsLayout;

export default WorkspaceDetailsPage;
