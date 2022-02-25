import { FirestoreError } from 'firebase/firestore';

const getDBErrorMessage = ({ code }: FirestoreError) => {
  switch (code) {
    case 'unavailable':
      return "You're offline. Make sure you're on a stable Internet connection and try again.";
    default:
      return `Error: ${code}`;
  }
};

export default getDBErrorMessage;
