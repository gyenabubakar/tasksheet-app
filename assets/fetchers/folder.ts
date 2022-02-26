import { Folder, FolderModel } from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';
import { getWorkspace } from '~/assets/fetchers/workspace';

export function getFolder(id: string, uid: string, withTasks = false) {
  return () => {
    return new Promise<Folder>((resolve, reject) => {
      const app = getFirebaseApp();
      const db = getFirestore(app);

      const docRef = doc(db, 'folders', id);

      getDoc(docRef)
        .then(async (docResponse) => {
          if (!docResponse.exists()) {
            reject({
              title: 'This folder does not exist.',
              message:
                'The link you followed is probably broken or the folder has been deleted.',
            });
            return;
          }

          const data = docResponse.data() as Folder;
          const workspace = await getWorkspace(data.workspaceID, uid)();
          resolve({
            id: docResponse.id,
            ...data,
            workspace: {
              id: workspace.id,
              name: workspace.name,
            },
          } as Folder);
        })
        .catch((error) => {
          if (error) {
            reject({
              title: "Couldn't get folder info.",
              message: getDBErrorMessage(error),
            });
          }
        });
    });
  };
}
