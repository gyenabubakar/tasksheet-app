import { Folder, FolderModel } from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';
import { getWorkspace } from '~/assets/fetchers/workspace';

export function getFolder(id: string, uid: string) {
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
              isAdmin: workspace.isAdmin,
              isOwner: workspace.isOwner,
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

export function getFolders(workspaceID: string) {
  return () => {
    return new Promise<FolderModel[]>((resolve, reject) => {
      const db = getFirestore(getFirebaseApp());
      const foldersCollRef = collection(db, 'folders');

      const foldersQuery = query(
        foldersCollRef,
        where('workspaceID', '==', workspaceID),
      );

      getDocs(foldersQuery)
        .then((snapshot) => {
          const folders = snapshot.docs.map((_doc) => ({
            id: _doc.id,
            ..._doc.data(),
          })) as FolderModel[];
          resolve(folders);
        })
        .catch((error) => {
          if (error) {
            reject({
              title: "Couldn't get folders.",
              message: getDBErrorMessage(error),
            });
          }
        });
    });
  };
}
