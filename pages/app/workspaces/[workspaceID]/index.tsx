import { useEffect, useState } from 'react';
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
import Loading from '~/components/common/Loading';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import ErrorFallback from '~/components/common/ErrorFallback';
import { getFolders } from '~/assets/fetchers/folder';
import { FolderModel, Workspace } from '~/assets/firebase/firebaseTypes';

interface WorkspaceSubpageProps {
  workspace: Workspace;
}

const WorkspaceDetailsPage: PageWithLayout<WorkspaceSubpageProps> = ({
  workspace,
}) => {
  const router = useRouter();

  const [folders, setFolders] = useState<FolderModel[] | null>(null);
  const [foldersError, setFoldersError] = useState<{
    title: string;
    message: string;
  } | null>(null);

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
      getFolders(workspace.id!)()
        .then((data) => {
          setFolders(data);
          setFoldersError(null);
        })
        .catch((_error: any) => {
          setFoldersError(_error);
          setFolders(null);
        });
    }
  }, [workspace]);

  return (
    <>
      <Head>
        <title>
          {`${workspace.name} | `}
          Folders
          {pageTitleSuffix}
        </title>
      </Head>

      <main className="page-workspace-folders mt-8">
        {workspace && !folders && !foldersError && (
          <Loading
            loadingText="Getting workspace folders..."
            className="mt-12"
          />
        )}

        {workspace && foldersError && !folders && (
          <ErrorFallback
            title={foldersError.title}
            message={foldersError.message}
          />
        )}

        {!foldersError && folders && folders.length && (
          <div className="folders mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {folders.map(({ id, title, workspaceID, colour, category }) => (
              <Folder
                key={id}
                href={`/app/folder/${id}`}
                folder={{
                  id: id!,
                  name: title,
                  colour,
                  workspaceId: workspaceID,
                  category,
                }}
                canModify={Boolean(workspace?.isAdmin || workspace?.isOwner)}
                onEdit={(f) => onEditFolder(f)}
                onDelete={(f) => onDeleteFolder(f)}
              />
            ))}
          </div>
        )}

        {!foldersError && folders && !folders.length && (
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
  );
};

WorkspaceDetailsPage.layout = 'app';
WorkspaceDetailsPage.SecondaryLayout = WorkspaceDetailsHeader;

export default WorkspaceDetailsPage;
