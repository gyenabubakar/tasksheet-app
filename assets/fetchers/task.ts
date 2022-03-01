import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  Query,
  query,
  where,
} from 'firebase/firestore';
import { TaskModel } from '~/assets/firebase/firebaseTypes';
import getDBErrorMessage from '~/assets/firebase/getDBErrorMessage';
import { User } from 'firebase/auth';
import { AppHomeTabType } from '~/assets/ts/types';

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

export function getUserTasks(user: User, status: AppHomeTabType = 'To do') {
  return () => {
    return new Promise<TaskModel[]>((resolve, reject) => {
      const tasks: TaskModel[] = [];

      const tasksCollRef = collection(getFirestore(), 'tasks');
      let tasksQuery: Query<DocumentData> | null = null;

      switch (status) {
        case 'Done':
          tasksQuery = query(
            tasksCollRef,
            where('createdBy.uid', '==', user.uid),
            where('isCompleted', '==', true),
          );
          break;
        case 'To do':
        default:
          tasksQuery = query(
            tasksCollRef,
            where('createdBy.uid', '==', user.uid),
            where('isCompleted', '==', false),
          );
      }

      getDocs(tasksQuery)
        .then((snapshot) => {
          snapshot.docs.forEach((_doc) =>
            tasks.push({
              id: _doc.id,
              ..._doc.data(),
            } as TaskModel),
          );

          resolve(tasks);
        })
        .catch((err) => {
          reject({
            title: `Failed to get tasks.`,
            message: getDBErrorMessage(err),
          });
        });
    });
  };
}

export function getFolderTasks(
  folderID: string,
  status: AppHomeTabType = 'To do',
) {
  return () => {
    return new Promise<TaskModel[]>((resolve, reject) => {
      const tasks: TaskModel[] = [];

      const tasksCollRef = collection(getFirestore(), 'tasks');
      let tasksQuery: Query<DocumentData> | null = null;

      switch (status) {
        case 'Done':
          tasksQuery = query(
            tasksCollRef,
            where('folder.id', '==', folderID),
            where('isCompleted', '==', true),
          );
          break;
        case 'To do':
        default:
          tasksQuery = query(
            tasksCollRef,
            where('folder.id', '==', folderID),
            where('isCompleted', '==', false),
          );
      }

      getDocs(tasksQuery)
        .then((snapshot) => {
          snapshot.docs.forEach((_doc) =>
            tasks.push({
              id: _doc.id,
              ..._doc.data(),
            } as TaskModel),
          );

          resolve(tasks);
        })
        .catch((err) => {
          reject({
            title: `Failed to get tasks.`,
            message: getDBErrorMessage(err),
          });
        });
    });
  };
}
