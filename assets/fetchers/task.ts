import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { TaskModel } from '~/assets/firebase/firebaseTypes';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';

export function getTask(id: string) {
  return () => {
    return new Promise<TaskModel>((resolve, reject) => {
      const taskRef = doc(getFirestore(), 'tasks', id);
      getDoc(taskRef)
        .then((_doc) =>
          resolve({
            id: _doc.id,
            ..._doc.data(),
          } as TaskModel),
        )
        .catch((error) => {
          reject({
            title: 'Error getting task info',
            message: getDBErrorMessage(error),
          });
        });
    });
  };
}
