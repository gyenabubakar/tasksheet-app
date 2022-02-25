import { FirestoreError } from 'firebase/firestore';
import swal from '~/assets/ts/sweetalert';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';

const alertDBError = async (error: FirestoreError, title: string) => {
  if (error) {
    await swal({
      icon: 'error',
      title,
      text: getDBErrorMessage(error),
    });
  }
};

export default alertDBError;
