import { auth } from 'firebase-admin';
import FirebaseApp from '~/netlify/firebase/app';

const FirebaseAuth = auth(FirebaseApp);

export default FirebaseAuth;
