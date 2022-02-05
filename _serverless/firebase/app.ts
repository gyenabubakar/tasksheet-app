import * as FirebaseAdmin from 'firebase-admin';
import getFirebasePrivateKey from '~/_serverless/firebase/private-key';

const firebasePrivateKey = getFirebasePrivateKey();

const FirebaseApp = FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert({
    privateKey: firebasePrivateKey.private_key,
    clientEmail: firebasePrivateKey.client_email,
    projectId: firebasePrivateKey.project_id,
  }),
});

export default FirebaseApp;
