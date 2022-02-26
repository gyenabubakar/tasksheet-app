import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';

import { FolderType, PageWithLayout } from '~/assets/ts/types';
import WorkspaceDetailsHeader from '~/components/workspace/WorkspaceDetailsHeader';
import Folder from '~/components/workspace/Folder';
import swal from '~/assets/ts/sweetalert';
import illustrationEmpty from '~/assets/illustrations/empty.svg';
import Button from '~/components/common/Button';
import { Workspace } from '~/assets/firebase/firebaseTypes';
import Loading from '~/components/common/Loading';
import useWorkspace from '~/hooks/useWorkspace';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import ErrorFallback from '~/components/common/ErrorFallback';
import { useEffect } from 'react';
import { getFolders } from '~/assets/fetchers/folder';

const WorkspaceDetailsPage: PageWithLayout = () => {
  const router = useRouter();
  const { error, workspace } = useWorkspace();

  const folders: FolderType[] = [
    {
      id: '1',
      name: 'Mobile Apps',
      colour: '#5C68FF',
      category: 'Development',
      tasks: { completed: 3, total: 8 },
    },
    {
      id: '2',
      name: '3D Animations',
      colour: '#14CC8A',
      category: 'Modelling, Colouring',
      tasks: { completed: 9, total: 12 },
    },
    {
      id: '3',
      name: 'Blog Articles',
      colour: '#e11d48',
      category: 'Content Creation',
      tasks: { completed: 3, total: 18 },
    },
  ];

  async function onEditFolder(folder: FolderType) {
    // eslint-disable-next-line no-console
    await router.push(`/app/folder/${folder.id}/edit`);
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
      preConfirm(confirmed: boolean): Promise<any> | null {
        if (!confirmed) {
          return null;
        }

        const db = getFirestore();
        const folderRef = doc(db, 'folders', folder.id);
        return deleteDoc(folderRef);
      },
    }).then(async ({ isConfirmed }) => {
      if (isConfirmed) {
        await swal({
          icon: 'success',
          title: (
            <span>
              Deleted
              <span className="text-main">{folder.name}</span>!
            </span>
          ),
        });
      }
    });
  }

  useEffect(() => {
    if (workspace) {
      // console.log(workspace);
      getFolders(workspace.id!)().then((_folders) => {
        console.log(_folders);
      });
    }
  }, [workspace]);

  return (
    <>
      <Head>
        <title>
          {workspace && `${workspace.name} | `}
          Folders
          {pageTitleSuffix}
        </title>
      </Head>

      {!workspace && !error && (
        <Loading loadingText="Loading workspace..." className="mt-12" />
      )}

      {error && !workspace && (
        <ErrorFallback title={error.title} message={error.message} />
      )}

      {workspace && !error && (
        <>
          <WorkspaceDetailsHeader workspace={workspace as Workspace} />

          <main className="page-workspace-folders mt-8">
            <p className="text-darkgray font-medium">
              {folders.length} folders
            </p>

            {folders.length ? (
              <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {folders.map((folder) => (
                  <Folder
                    href={`/app/folder/${folder.id}`}
                    key={folder.id}
                    folder={folder}
                    onEdit={(f) => onEditFolder(f)}
                    onDelete={(f) => onDeleteFolder(f)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state flex flex-col justify-center items-center mt-24">
                <div className="w-[247px] h-[241px] relative">
                  <Image src={illustrationEmpty} priority />
                </div>

                <h3 className="font-bold text-[24px] mt-10">
                  There are no folders in this workspace.
                </h3>

                <div className="mt-10">
                  <Button
                    paddingClasses="px-8 py-6"
                    onClick={() =>
                      router.push(`/app/workspaces/${workspace.id}/new-folder`)
                    }
                  >
                    Create New Folder
                  </Button>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </>
  );
};

WorkspaceDetailsPage.layout = 'app';

export default WorkspaceDetailsPage;
