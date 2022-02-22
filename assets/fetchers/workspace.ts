import { doc, FirestoreError, getDoc, getFirestore } from 'firebase/firestore';

import { WorkspacesModel } from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';

export function getWorkspace(id: string) {
  return () => {
    return new Promise((resolve, reject) => {
      const app = getFirebaseApp();
      const db = getFirestore(app);

      const docRef = doc(db, 'workspaces', id);

      getDoc(docRef)
        .then((docResponse) => {
          if (!docResponse.exists()) {
            reject({
              title: 'This workspace does not exist.',
              message:
                'The link you followed is probably broken or the workspace has been deleted.',
            });
            return;
          }

          resolve({
            id: docResponse.id,
            ...docResponse.data(),
          } as WorkspacesModel);
        })
        .catch((error) => {
          if (error) {
            reject({
              title: "Couldn't get workspace info.",
              message: `Error: ${(error as FirestoreError).code}`,
            });
          }
        });
    });
  };
}
