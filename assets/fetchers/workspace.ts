import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import { Workspace, WorkspacesModel } from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';

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

          if (data.createdBy !== uid && !data.members.includes(uid)) {
            reject({
              title: "You don't have access to this workspace.",
              message: "You're not a member or creator of this workspace.",
            });
          }

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
              message: getDBErrorMessage(error),
            });
          }
        });
    });
  };
}

export function getWorkspaces(uid: string) {
  return () => {
    return new Promise<WorkspacesModel[]>((resolve, reject) => {
      const db = getFirestore(getFirebaseApp());
      const workspacesCollRef = collection(db, 'workspaces');

      let workspaces: WorkspacesModel[] = [];

      const adminQuery = query(
        workspacesCollRef,
        where('createdBy', '==', uid),
      );

      const memberQuery = query(
        workspacesCollRef,
        where('members', 'array-contains-any', [uid]),
      );

      getDocs(adminQuery)
        .then((snapshot) => {
          workspaces = snapshot.docs.map((_doc) => ({
            id: _doc.id,
            ..._doc.data(),
          })) as WorkspacesModel[];

          getDocs(memberQuery)
            .then((membersSnapshot) => {
              workspaces = [
                ...workspaces,
                ...(membersSnapshot.docs.map((_doc) => ({
                  id: _doc.id,
                  ..._doc.data(),
                })) as WorkspacesModel[]),
              ];

              resolve(workspaces);
            })
            .catch((error) => {
              reject({
                title: `Couldn't get workspaces.`,
                message: getDBErrorMessage(error),
              });
            });
        })
        .catch((error) => {
          reject({
            title: `Couldn't get workspaces.`,
            message: getDBErrorMessage(error),
          });
        });
    });
  };
}
