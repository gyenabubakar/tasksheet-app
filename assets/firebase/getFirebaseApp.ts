import { initializeApp } from 'firebase/app';
import firebaseConfig from '~/assets/firebase/firebaseConfig';

const getFirebaseApp = () => initializeApp(firebaseConfig);

export default getFirebaseApp;
