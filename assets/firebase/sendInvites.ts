import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { User } from 'firebase/auth';

import {
  InvitationModel,
  InviteNotification,
  NotificationType,
  Workspace,
} from '~/assets/firebase/firebaseTypes';

const sendInvites = async (
  emails: string[],
  user: User,
  workspace: Workspace,
) => {
  const emailsWithNoAccounts: string[] = [];
  const userIDs: string[] = [];

  const db = getFirestore();
  const invitesBatch = writeBatch(db);
  const notificationsBatch = writeBatch(db);
  const usersCollRef = collection(db, 'users');

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];

    const usersQuery = query(usersCollRef, where('email', '==', email));
    // eslint-disable-next-line no-await-in-loop
    const snapshot = await getDocs(usersQuery);

    if (!snapshot.docs.length) {
      emailsWithNoAccounts.push(email);
      continue;
    }

    userIDs.push(snapshot.docs[0].id);
  }

  if (emailsWithNoAccounts.length) {
    const isOne = emailsWithNoAccounts.length === 1;
    throw new Error(
      `${isOne ? 'This' : 'These'} ${isOne ? 'email' : 'emails'} ${
        isOne ? 'is' : 'are'
      } not associated with any TaskSheet ${isOne ? "user's" : "users'"} ${
        isOne ? 'account' : 'accounts'
      }: ${isOne ? emailsWithNoAccounts[0] : emailsWithNoAccounts.join(', ')}`,
    );
  }

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i];
    const inviteRef = doc(db, 'invitations', uuid());
    const notificationRef = doc(
      db,
      `users/${userIDs[i]}`,
      `notifications`,
      uuid(),
    );

    const inviteObj: InvitationModel = {
      email,
      sender: {
        uid: user.uid,
        name: user.displayName!,
        avatar: user.photoURL,
      },
      workspace: {
        id: workspace.id!,
        name: workspace.name,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    invitesBatch.set(inviteRef, inviteObj);

    notificationsBatch.set(notificationRef, {
      type: NotificationType.WorkspaceInviteCreated,
      message: `${user.displayName} has invited you to join ${workspace.name}.`,
      createdAt: serverTimestamp(),
      readAt: null,
      payload: {
        id: inviteRef.id,
        ...inviteObj,
      },
    } as InviteNotification);
  }

  await invitesBatch.commit();
  notificationsBatch.commit();
};

export default sendInvites;
