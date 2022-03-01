import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { TaskModel } from '~/assets/firebase/firebaseTypes';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';
import { User } from 'firebase/auth';
import { reject } from 'lodash';

export function getTask(id: string) {
  return () => {
    return new Promise<TaskModel>((resolve, reject) => {
      const taskRef = doc(getFirestore(), 'tasks', id);
      getDoc(taskRef)
        .then((_doc) => {
          if (!_doc.exists()) {
            reject({
              title: 'Task not found.',
              message: `The link you followed is probably broken or the task has been deleted.`,
            });
            return;
          }

          resolve({
            id: _doc.id,
            ..._doc.data(),
          } as TaskModel);
        })
        .catch((error) => {
          reject({
            title: 'Error getting task info',
            message: getDBErrorMessage(error),
          });
        });
    });
  };
}

export function getUserTasks(user: User) {
  return () => {
    return new Promise<TaskModel[]>((resolve, reject) => {
      const tasks: TaskModel[] = [];

      const tasksQuery = query(
        collection(getFirestore(), 'tasks'),
        where('createdBy.uid', '==', user.uid),
      );

      getDocs(tasksQuery).then((snapshot) => {
        snapshot.docs.forEach((_doc) =>
          tasks.push({
            id: _doc.id,
            ..._doc.data(),
          } as TaskModel),
        );

        resolve(tasks);
      });
    }).catch((err) => {
      reject({
        title: `Failed to get tasks.`,
        message: getDBErrorMessage(err),
      });
    });
  };
}
