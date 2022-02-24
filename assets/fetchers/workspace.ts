import { doc, FirestoreError, getDoc, getFirestore } from 'firebase/firestore';

import { Workspace, WorkspacesModel } from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';

export function getWorkspace(id: string, uid: string) {
  return () => {
    return new Promise<Workspace>((resolve, reject) => {
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

          const data = docResponse.data() as WorkspacesModel;
          resolve({
            id: docResponse.id,
            ...data,
            hasNewJoinRequests: false, // TODO: hasNewJoinRequests
            isAdmin: data.admins.includes(uid),
            isOwner: data.createdBy === uid,
          } as Workspace);
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
