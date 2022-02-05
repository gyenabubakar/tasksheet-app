import { auth } from 'firebase-admin';
import FirebaseApp from '~/_serverless/firebase/app';

const FirebaseAuth = auth(FirebaseApp);

export default FirebaseAuth;
