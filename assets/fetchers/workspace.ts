import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { User } from 'firebase/auth';

import {
  UserModel,
  Workspace,
  WorkspaceModel,
} from '~/assets/firebase/firebaseTypes';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';

export function getWorkspace(id: string, uid: string, validateAccess = true) {
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

          const data = docResponse.data() as WorkspaceModel;

          if (validateAccess) {
            if (data.createdBy !== uid && !data.members.includes(uid)) {
              reject({
                title: "You don't have access to this workspace.",
                message: "You're not a member or creator of this workspace.",
              });
            }
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
    return new Promise<WorkspaceModel[]>((resolve, reject) => {
      const db = getFirestore(getFirebaseApp());
      const workspacesCollRef = collection(db, 'workspaces');

      let workspaces: WorkspaceModel[] = [];

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
          })) as WorkspaceModel[];

          return getDocs(memberQuery).then(async (membersSnapshot) => {
            workspaces = [
              ...workspaces,
              ...(membersSnapshot.docs.map((_doc) => ({
                id: _doc.id,
                ..._doc.data(),
              })) as WorkspaceModel[]),
            ];

            resolve(workspaces);
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

export function getMembers(workspaceID: string, user: User) {
  return () => {
    return new Promise<UserModel[]>((resolve, reject) => {
      const db = getFirestore();

      getWorkspace(workspaceID, user.uid)()
        .then((workspace) => {
          getDoc(doc(db, 'users', workspace.createdBy)).then((_doc) => {
            const allMembers: UserModel[] = [_doc.data() as UserModel];

            console.log(workspace.members.length);
            if (workspace.members.length) {
              const usersCollRef = collection(db, 'users');
              const membersQuery = query(
                usersCollRef,
                where('uid', 'in', workspace.members),
              );
              getDocs(membersQuery).then((snapshot) => {
                snapshot.docs.map((__doc) =>
                  allMembers.push(__doc.data() as UserModel),
                );
                resolve(allMembers);
              });
            } else {
              resolve(allMembers);
            }
          });
        })
        .catch((error) => {
          reject({
            title: `Couldn't get members.`,
            error: getDBErrorMessage(error),
          });
        });
    });
  };
}
