import { auth } from 'firebase-admin';
import FirebaseApp from '~/.serverless/firebase/app';

const FirebaseAuth = auth(FirebaseApp);

export default FirebaseAuth;
