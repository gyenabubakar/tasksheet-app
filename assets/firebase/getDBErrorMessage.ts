import { FirestoreError } from 'firebase/firestore';

const getDBErrorMessage = (error: FirestoreError) => {
  const { code } = error;

  if (code) {
    switch (code) {
      case 'unavailable':
        return "You're offline. Make sure you're on a stable Internet connection and try again.";
      default:
        return `Error: ${code}`;
    }
  }

  return error.message;
};

export default getDBErrorMessage;
