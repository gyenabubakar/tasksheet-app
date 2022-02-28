import React, {
  FormEvent,
  forwardRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import {
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import ReactTooltip from 'react-tooltip';
import dynamic from 'next/dynamic';
import moment from 'moment';
import Link from 'next/link';
import { v4 as uuid } from 'uuid';
import DatePicker from 'react-datepicker';
import { isEqual } from 'lodash';

import {
  DropdownItem,
  PageWithLayout,
  TaskPriority,
  TaskPriorityColour,
} from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import iconPeople from '~/assets/icons/task/people.svg';
import iconWorkspace from '~/assets/icons/task/workspace.svg';
import iconFolder from '~/assets/icons/task/folder.svg';
import iconCalendar from '~/assets/icons/task/calendar.svg';
import iconFlag from '~/assets/icons/task/flag.svg';
import DropdownMultiple from '~/components/workspace/DropdownMultiple';
import calculateTimeLeft from '~/assets/ts/calculateTimeLeft';
import { getTask } from '~/assets/fetchers/task';
import {
  FolderModel,
  NotificationType,
  TaskAssignedNotification,
  TaskAssignee,
  TaskChecklistItem,
  TaskModel,
  TaskPriorityChangedNotification,
  TaskStatusChangedNotification,
  UserModel,
} from '~/assets/firebase/firebaseTypes';
import useUser from '~/hooks/useUser';
import Loading from '~/components/common/Loading';
import ErrorFallback from '~/components/common/ErrorFallback';
import Dropdown from '~/components/workspace/Dropdown';
import { getFolders } from '~/assets/fetchers/folder';
import swal from '~/assets/ts/sweetalert';
import alertDBError from '~/assets/firebase/alertDBError';
import { getMembers } from '~/assets/fetchers/workspace';
import { User } from 'firebase/auth';

const TaskDescriptionEditor = dynamic(
  () => import('~/components/workspace/TaskDescriptionEditor'),
  {
    ssr: false,
  },
);

interface Assignee extends DropdownItem {
  avatar: string | null;
}

interface Folder extends DropdownItem {
  colour: string;
}

interface ChecklistItem {
  key: string | number;
  description: string;
  isDone: boolean;
}

type TabType = 'Description' | 'Checklist';

const assigneesToDropdownItems = (
  assignees: TaskAssignee[],
  user: User,
): DropdownItem[] => {
  return assignees.map(({ uid, name, avatar }) => {
    const assigneeName = uid === user.uid ? 'Me' : name;
    return {
      id: uid,
      value: (
        <div className="flex items-center">
          <div className="h-8 w-8 relative rounded-full bg-main overflow-hidden mr-3 ring-2 ring-white">
            {avatar && <Image src={avatar} alt={assigneeName} layout="fill" />}
          </div>

          <span>{assigneeName}</span>
        </div>
      ),
      searchable: assigneeName,
      avatar,
    };
  });
};

interface DatePickerInputProps {
  value?: Date | null;
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
  onClear: () => void;
}

const DatePickerInput = forwardRef(
  (
    { value, onClick, onClear }: DatePickerInputProps,
    ref: Ref<HTMLButtonElement>,
  ) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="text-main text-sm md:text-base hover:text-darkmain flex items-center"
    >
      <span>{value || 'Select'}</span>
      {value && (
        <span
          className="text-red-500 text-3xl font-bold hover:text-red-600 ml-2"
          title="Clear date"
          onClick={onClear}
        >
          &times;
        </span>
      )}
    </button>
  ),
);

const TaskDescriptionPage: PageWithLayout = () => {
  const router = useRouter();
  const { taskID } = router.query;
  const { user } = useUser();

  const { error, data: fetchedTask } = useSWR(
    'get-task-info',
    getTask(taskID as string),
    {
      revalidateOnReconnect: true,
      revalidateOnFocus: false,
      refreshWhenHidden: false,
      revalidateIfStale: false,
    },
  );

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');

  const [task, setTask] = useState<TaskModel | undefined>(undefined);

  const [folders, setFolders] = useState<FolderModel[] | null>(null);
  const [members, setMembers] = useState<UserModel[] | null>(null);

  const [gettingFolders, setGettingFolders] = useState(false);
  const [gettingMembers, setGettingMembers] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const isDescriptionTab = activeTab === 'Description';
  const isChecklistTab = activeTab === 'Checklist';

  const nameIsValid = task?.title
    ? task?.title.length >= 2 && task?.title.length < 120
    : null;
  const folderIsValid = !!task?.folder;

  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  const timeLeft = (() => {
    if (task?.dueDate) {
      return calculateTimeLeft(moment(), moment(task.dueDate)) === 'Overdue'
        ? 'Overdue'
        : `${calculateTimeLeft(moment(), moment(task.dueDate))} left`;
    }
    return 'N/A';
  })();

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<DropdownItem | null>(
    null,
  );

  const dropdownFolders: Folder[] = folders
    ? folders.map(({ id, title: folderTitle, colour }) => ({
        id,
        searchable: folderTitle,
        colour,
        value: (
          <div className="flex items-center">
            <div
              className="h-6 w-6 relative rounded-full overflow-hidden mr-3 ring-2 ring-white"
              style={{ backgroundColor: colour }}
            />
            <span>{folderTitle}</span>
          </div>
        ),
      }))
    : [];

  const dropdownMembers: Assignee[] = members
    ? members.map(({ uid, avatar, displayName }) => {
        const name = uid === user.uid ? 'Me' : displayName;
        return {
          id: uid,
          searchable: uid === user.uid ? 'Me' : name,
          avatar,
          value: (
            <div className="flex items-center">
              <div className="h-8 w-8 relative rounded-full bg-main overflow-hidden mr-3 ring-2 ring-white">
                {avatar && (
                  <Image src={avatar} alt={name} priority layout="fill" />
                )}
              </div>

              <span>{name}</span>
            </div>
          ),
        };
      })
    : [];

  const priorities: DropdownItem[] = [
    {
      id: TaskPriority.Low,
      value: TaskPriority.Low,
    },
    {
      id: TaskPriority.Normal,
      value: TaskPriority.Normal,
    },
    {
      id: TaskPriority.High,
      value: TaskPriority.High,
    },
    {
      id: TaskPriority.Urgent,
      value: TaskPriority.Urgent,
    },
  ];

  function onSelectFolder() {
    setShowFolderDropdown((prevState) => !prevState);
  }

  function handleSelectAssignees() {
    setShowMembersDropdown((prevState) => !prevState);
  }

  function checklistItemIsDuplicate(itemDescription: string, index: number) {
    return (
      itemDescription &&
      task?.checklist
        .filter((_, i) => i !== index)
        .some(
          (item) =>
            item.description.toLowerCase() === itemDescription.toLowerCase(),
        )
    );
  }

  function hasDuplicateChecklistItems(
    _checklist: ChecklistItem[] | null = null,
  ) {
    const items = (_checklist || task?.checklist)?.map(
      (item) => item.description,
    );
    const uniqueItems = new Set(items);
    return items?.length !== uniqueItems.size;
  }

  function getProgressPercent() {
    const { checklist: _checklist } = task!;
    const completedChecklistItems = _checklist.filter(
      (item) => item.isDone,
    ).length;
    const percent = (completedChecklistItems / _checklist.length) * 100;
    return parseFloat(percent.toFixed(2));
  }

  function getAssigneeName(assignee: TaskAssignee) {
    if (assignee.uid === user.uid) return 'Me';
    return assignee.name;
  }

  function notifyAboutStatusChange(isCompleted: boolean) {
    if (task) {
      if (task.assignees.length) {
        const db = getFirestore();
        const batch = writeBatch(db);

        task.assignees
          .filter((assignee) => assignee.uid !== user.uid)
          .forEach((assignee) => {
            const assigneeNotifRef = doc(
              db,
              `users/${assignee.uid}`,
              `notifications`,
              uuid(),
            );

            batch.set(assigneeNotifRef, {
              type: NotificationType.TaskStatusChanged,
              readAt: null,
              message: `${user.displayName} marked the task ${task.title} as ${
                isCompleted ? 'Completed' : 'In Progress'
              }.`,
              createdAt: serverTimestamp(),
              payload: {
                sender: {
                  uid: user.uid,
                  name: user.displayName!,
                  avatar: user.photoURL,
                },
                task,
              },
            } as TaskStatusChangedNotification);
          });

        batch.commit();
      }
    }
  }

  function onChangeStatus(isCompleted: boolean) {
    if (task) {
      const statusChanged = task.isCompleted !== isCompleted;

      const checklistCopy = task.checklist.map(
        (item) =>
          ({
            description: item.description,
            isDone: isCompleted,
          } as TaskChecklistItem),
      );

      setTask({
        ...task,
        checklist: checklistCopy,
        isCompleted,
      });

      const db = getFirestore();
      const taskRef = doc(db, 'tasks', task.id!);
      updateDoc(taskRef, {
        checklist: checklistCopy,
        isCompleted,
      }).then(() => {
        if (statusChanged) {
          notifyAboutStatusChange(isCompleted);
        }
      });
    }
  }

  function changeTodoStatus(todo: TaskChecklistItem, index: number) {
    if (task) {
      const todoCopy = { ...todo };
      todoCopy.isDone = !todoCopy.isDone;

      const checklistCopy = [...task.checklist];
      checklistCopy.splice(index, 1, todoCopy);

      const allItemsAreChecked = checklistCopy
        .map(({ isDone }) => isDone)
        .reduce((prevItem, currItem) => prevItem && currItem);

      const statusChanged = task.isCompleted !== allItemsAreChecked;

      setTask({
        ...task,
        checklist: checklistCopy,
        isCompleted: allItemsAreChecked,
      });

      const db = getFirestore();
      const taskRef = doc(db, 'tasks', task.id!);
      updateDoc(taskRef, {
        checklist: checklistCopy,
        isCompleted: allItemsAreChecked,
      }).then(() => {
        if (statusChanged) {
          notifyAboutStatusChange(allItemsAreChecked);
        }
      });
    }
  }

  function listenForChanges() {
    const taskRef = doc(getFirestore(), 'tasks', taskID as string);
    return onSnapshot(taskRef, (snapshot) => {
      setTask({
        id: snapshot.id,
        ...snapshot.data(),
      } as TaskModel);
    });
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function updateLocalTask(_fetchedTask: TaskModel | undefined) {
    if (_fetchedTask) {
      if (task === undefined) {
        setTask(_fetchedTask);
        return;
      }

      const remoteAndLocalTaskObjectsAreDifferent = !isEqual(
        _fetchedTask,
        task,
      );
      if (remoteAndLocalTaskObjectsAreDifferent) {
        setTask(_fetchedTask);
      }
    }
  }

  useEffect(() => {
    updateLocalTask(fetchedTask);

    if (fetchedTask) {
      setGettingFolders(true);
      getFolders(fetchedTask.workspace.id)()
        .then((_folders) => {
          if (!_folders.length) {
            swal({
              icon: 'warning',
              title: "You can't create a task.",
              html: (
                <span>
                  This is because there are no folders in the workspace you
                  selected. Please inform an admin of&nbsp;
                  <span className="text-main">
                    {fetchedTask.workspace.name}
                  </span>
                  &nbsp;to create a folder for you, or create it yourself if
                  you&apos;re an admin.
                </span>
              ),
              showConfirmButton: true,
            }).then(async () => {
              await router.push(`/app/workspaces/${fetchedTask.workspace.id}`);
            });
          }
          setFolders(_folders);
        })
        .catch(async (err) => {
          await alertDBError(
            err,
            `Couldn't get folders in ${fetchedTask.workspace.name}`,
          );
        })
        .finally(() => {
          setGettingFolders(false);
        });

      setGettingMembers(true);
      getMembers(fetchedTask.workspace.id, user)()
        .then((_members) => {
          setMembers([..._members]);
        })
        .catch(async (err) => {
          await alertDBError(
            err,
            `Failed to get members of ${fetchedTask.workspace.name}.`,
          );
        })
        .finally(() => {
          setGettingMembers(false);
        });

      setSelectedPriority(
        fetchedTask.priority
          ? {
              id: TaskPriority[fetchedTask.priority],
              value: TaskPriority[fetchedTask.priority],
            }
          : null,
      );

      setChecklist(
        fetchedTask.checklist.map((item) => ({
          key: uuid(),
          description: item.description,
          isDone: item.isDone,
        })),
      );
    }

    return () => unsubscribeRef.current?.();
  }, [fetchedTask]);

  // watch priority for changes
  useEffect(() => {
    if (task && selectedPriority?.value !== task.priority) {
      setTask({
        ...task,
        priority: (selectedPriority?.value as TaskPriority) || null,
      });

      if (task?.title.trim()) {
        const db = getFirestore();
        const notificationsBatch = writeBatch(db);

        // notify newly added assignees
        task.assignees
          .filter((a) => a.uid !== user.uid)
          .forEach((uid) => {
            const assigneeNotifRef = doc(
              db,
              `users/${uid}`,
              `notifications`,
              uuid(),
            );

            notificationsBatch.set(assigneeNotifRef, {
              type: NotificationType.TaskPriorityChanged,
              readAt: null,
              message: `${
                user.displayName
              } changed the priority of the task: ${task?.title.trim()}.`,
              createdAt: serverTimestamp(),
              payload: {
                sender: {
                  uid: user.uid,
                  name: user.displayName!,
                  avatar: user.photoURL,
                },
                task,
              },
            } as TaskPriorityChangedNotification);
          });

        notificationsBatch.commit();
      }
    }
  }, [selectedPriority]);

  // watch checklist for changes
  useEffect(() => {
    if (task) {
      const validChecklist = checklist.filter((item) =>
        Boolean(item.description),
      );

      if (!hasDuplicateChecklistItems(validChecklist)) {
        const allItemsAreChecked = validChecklist
          .map(({ isDone }) => isDone)
          .reduce((prevItem, currItem) => prevItem && currItem);

        const newChecklist: TaskChecklistItem[] = validChecklist.map(
          (item) => ({
            description: item.description,
            isDone: item.isDone,
          }),
        );

        const checklistChanged = !isEqual(newChecklist, task.checklist);

        if (checklistChanged) {
          setTask({
            ...task,
            checklist: newChecklist,
            isCompleted: allItemsAreChecked,
          });
        }
      }
    }
  }, [checklist]);

  // watch task for changes
  useEffect(() => {
    if (task) {
      const allItemsAreChecked = task.checklist
        .map(({ isDone }) => isDone)
        .reduce((prevItem, currItem) => prevItem && currItem);

      const statusChanged = task.isCompleted !== allItemsAreChecked;

      const db = getFirestore();
      const taskRef = doc(db, 'tasks', task.id!);

      const taskCopy = { ...task };
      delete taskCopy.id;

      // console.log(task);
      // return;

      if (task.title.trim() && folderIsValid) {
        updateDoc(taskRef, {
          ...taskCopy,
          title: task.title.trim(),
          updatedAt: serverTimestamp(),
        }).then(() => {
          if (statusChanged) {
            notifyAboutStatusChange(allItemsAreChecked);
          }

          const remoteTaskAssigneesUIDs = fetchedTask!.assignees.map(
            (a) => a.uid,
          );
          const localTaskAssigneesUIDs = task.assignees.map((a) => a.uid);

          const notificationsBatch = writeBatch(db);

          // notify newly added assignees
          localTaskAssigneesUIDs
            .filter((uid) => uid !== user.uid)
            .forEach((uid) => {
              if (!remoteTaskAssigneesUIDs.includes(uid)) {
                const assigneeNotifRef = doc(
                  db,
                  `users/${uid}`,
                  `notifications`,
                  uuid(),
                );

                notificationsBatch.set(assigneeNotifRef, {
                  type: NotificationType.TaskAssigned,
                  readAt: null,
                  message: `${
                    user.displayName
                  } assigned you to the task: ${task?.title.trim()}.`,
                  createdAt: serverTimestamp(),
                  payload: {
                    sender: {
                      uid: user.uid,
                      name: user.displayName!,
                      avatar: user.photoURL,
                    },
                    task,
                  },
                } as TaskAssignedNotification);
              }
            });

          notificationsBatch.commit();
        });
      }
    }
  }, [task]);

  return (
    <>
      <Head>
        <title>{task ? task.title : 'Task'} · TaskSheet</title>
      </Head>

      <Navigation>
        {task && (
          <button
            className={`text-sm px-3 py-1 rounded-md flex items-center ${
              task.isCompleted
                ? 'bg-gray-400 hover:bg-gray-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={() => onChangeStatus(!task?.isCompleted)}
          >
            <span className="text-white font-light">
              Mark as{' '}
              <span className="font-medium">
                {task.isCompleted ? 'In Progress' : 'Completed'}
              </span>
            </span>
          </button>
        )}
      </Navigation>

      {!fetchedTask && !error && (
        <Loading loadingText="Loading task..." className="mt-12" />
      )}

      {error && !fetchedTask && (
        <ErrorFallback title={error.title} message={error.message} />
      )}

      {fetchedTask && task && !error && (
        <main className="page-new-task">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="name">
              <div>
                <span
                  className={`status-badge text-sm font-medium text-white px-2 py-1 rounded-md cursor-default ${
                    !task.isCompleted ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                >
                  {!task.isCompleted ? 'In Progress' : 'Completed'}
                </span>
              </div>

              <br />
              <div className="input-container relative">
                <input
                  type="text"
                  id="task-name"
                  minLength={1}
                  required
                  autoComplete="off"
                  value={task.title}
                  className="bg-transparent border-0 text-xl md:text-3xl outline-0 font-bold w-full my-3 block"
                  onChange={(e) => {
                    if (e.target.value !== task?.title) {
                      setTask({
                        ...task,
                        title: e.target.value,
                      });
                    }
                  }}
                />

                <label
                  htmlFor="task-name"
                  className="text-3xl font-bold absolute cursor-text"
                >
                  Task title...
                </label>
              </div>
              {nameIsValid === false && (
                <small className="text-red font-medium text-red-500">
                  Name must be between 2 and 120 characters long.
                </small>
              )}
            </div>

            <div className="details mt-10">
              <div className="workspace-wrapper relative">
                <div className="workspace grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconWorkspace} layout="fill" priority />
                    </div>

                    <span className="text-darkgray md:text-xl font-medium ml-3">
                      Workspace
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    <Link href={`/app/workspaces/${task.workspace.id}`}>
                      <a className={`text-${task.folder.colour}`}>
                        {task.workspace.name}
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="folder-wrapper relative">
                <div className="folder grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconFolder} layout="fill" priority />
                    </div>

                    <span className="text-darkgray md:text-xl font-medium ml-3">
                      Folder
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    {task.folder && (
                      <button
                        id="workspaces-dropdown-button"
                        type="button"
                        className="text-main hover:text-darkmain flex items-center"
                        onClick={() => onSelectFolder()}
                      >
                        <span>{task.folder.title}</span>
                        {gettingFolders && (
                          <svg
                            className="animate-spin h-4 w-4 text-white ml-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            data-tip
                            data-for="folders-loading"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="#121212"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="#121212"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {isMounted && (
                          <ReactTooltip
                            id="folders-loading"
                            place="top"
                            type="dark"
                            effect="solid"
                          >
                            Getting folders in workspace
                          </ReactTooltip>
                        )}
                      </button>
                    )}
                  </div>

                  {showFolderDropdown && (
                    <Dropdown
                      id="workspaces-dropdown"
                      options={dropdownFolders}
                      value={selectedFolder}
                      className="absolute left-[0px] top-[30px]"
                      onSelect={(item) => setSelectedFolder(item)}
                      onClose={() => setShowFolderDropdown(false)}
                    />
                  )}
                </div>
              </div>

              <div className="assignees-wrapper relative">
                <div className="assignees grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconPeople} layout="fill" priority />
                    </div>

                    <span className="text-darkgray lg:text-xl font-medium ml-3">
                      Assign to
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 overflow-hidden">
                        {task &&
                          task.assignees.slice(0, 6).map((assignee, index) => {
                            return (
                              <div
                                key={assignee.uid}
                                className="flex items-center"
                              >
                                <div
                                  data-tip
                                  data-for={`assignee-${assignee.uid}`}
                                  key={assignee.uid}
                                  className="h-8 w-8 rounded-full bg-main ring-2 ring-white inline-block overflow-hidden relative"
                                >
                                  {assignee.avatar && (
                                    <Image
                                      src={assignee.avatar}
                                      alt={assignee.name}
                                      layout="fill"
                                      priority
                                    />
                                  )}

                                  {task &&
                                    task.assignees.length > 6 &&
                                    index === 5 && (
                                      <div
                                        className="overlay absolute h-full w-full bg-black opacity-70 text-white text-sm font-medium flex items-center justify-center cursor-pointer"
                                        onClick={() =>
                                          setShowMembersDropdown(
                                            (prevState) => !prevState,
                                          )
                                        }
                                      >
                                        +{task.assignees.length - 5}
                                      </div>
                                    )}
                                </div>

                                {isMounted && (
                                  <ReactTooltip
                                    id={`assignee-${assignee.uid}`}
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  >
                                    {index === 5
                                      ? `${task.assignees.length - 5} more`
                                      : getAssigneeName(assignee)}
                                  </ReactTooltip>
                                )}
                              </div>
                            );
                          })}
                      </div>

                      <button
                        id="assignees-dropdown-button"
                        type="button"
                        className="text-main w-8 h-8 rounded-full border border-main flex items-center justify-center text-xl ml-2 hover:bg-main hover:text-white"
                        onClick={() => handleSelectAssignees()}
                      >
                        +
                      </button>

                      {gettingMembers && (
                        <svg
                          className="animate-spin h-4 w-4 text-white ml-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          data-tip
                          data-for="members-loading"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#121212"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="#121212"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}

                      {isMounted && (
                        <ReactTooltip
                          id="members-loading"
                          place="top"
                          type="dark"
                          effect="solid"
                        >
                          Getting members of workspace
                        </ReactTooltip>
                      )}
                    </div>
                  </div>
                </div>

                {showMembersDropdown && (
                  <DropdownMultiple
                    id="assignees-dropdown"
                    options={dropdownMembers}
                    value={assigneesToDropdownItems(task.assignees, user)}
                    className="absolute mt-3 left-0 top-[30px]"
                    onSelect={(items) => {
                      setTask({
                        ...task,
                        assignees: (items as Assignee[]).map((a) => ({
                          uid: a.id,
                          name:
                            a.id === user.uid
                              ? user.displayName!
                              : a.searchable!,
                          avatar: a.avatar,
                        })),
                      });
                    }}
                    onClose={() => setShowMembersDropdown(false)}
                  />
                )}
              </div>

              <div className="duedate-wrapper relative">
                <div className="duedate grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconCalendar} layout="fill" priority />
                    </div>

                    <span className="text-darkgray md:text-xl font-medium ml-3">
                      Due date
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                      }}
                      timeFormat="hh:mm aa"
                      dateFormat="MMM d, yyyy @ h:mm aa"
                      minDate={new Date()}
                      filterTime={(date) =>
                        date.getTime() > new Date().getTime()
                      }
                      customInput={
                        <DatePickerInput
                          value={selectedDate}
                          onClear={() => setSelectedDate(null)}
                        />
                      }
                      showTimeSelect
                      showYearDropdown
                    />
                  </div>
                </div>
              </div>

              <div className="priority-wrapper relative">
                <div className="priority grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconFlag} layout="fill" priority />
                    </div>

                    <span className="text-darkgray md:text-xl font-medium ml-3">
                      Priority
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    {selectedPriority && (
                      <div className="flex items-center">
                        <span
                          style={{
                            color:
                              TaskPriorityColour[
                                selectedPriority.value as TaskPriority
                              ],
                          }}
                        >
                          {selectedPriority.value}
                        </span>

                        <button
                          className="text-2xl text-red-500 font-bold ml-3"
                          onClick={() => {
                            setSelectedPriority(null);
                            setShowPriorityDropdown(true);
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    )}

                    {!selectedPriority && (
                      <button
                        id="priorities-dropdown-button"
                        type="button"
                        className="text-main hover:text-darkmain"
                        onClick={() =>
                          setShowPriorityDropdown((prevState) => !prevState)
                        }
                      >
                        Select
                      </button>
                    )}
                  </div>

                  {showPriorityDropdown && (
                    <Dropdown
                      id="priorities-dropdown"
                      options={priorities}
                      value={selectedPriority}
                      className="absolute left-[0px] top-[30px]"
                      showSearchField={false}
                      onSelect={(item) => setSelectedPriority(item)}
                      onClose={() => setShowPriorityDropdown(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="task-explainer mt-16">
              <div className="explainer-nav flex justify-between">
                <div className="tabs text-sm md:text-base font-medium flex items-center bg-[#EAEBFF] px-1.5 py-1.5 rounded-[12px] w-full md:w-auto">
                  <div
                    className={`tab ${isDescriptionTab ? 'active' : ''}`}
                    onClick={() => setActiveTab('Description')}
                  >
                    Description
                  </div>

                  <div
                    className={`tab ${isChecklistTab ? 'active' : ''}`}
                    onClick={() => setActiveTab('Checklist')}
                  >
                    Checklist
                  </div>
                </div>
              </div>

              <div className="explainer-content">
                {isDescriptionTab && (
                  <div className="mt-16">
                    <TaskDescriptionEditor
                      value={task.editorjsData}
                      onChange={(newContent) => {
                        if (task && task.editorjsData !== newContent) {
                          setTask({
                            ...task,
                            editorjsData: newContent,
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {isChecklistTab && (
                  <div className="checklist-tab mt-10">
                    <ul>
                      {checklist.map(
                        (
                          { key, isDone, description: clDescription },
                          index,
                          list,
                        ) => (
                          <li key={key} className="mb-4">
                            <input
                              type="checkbox"
                              checked={isDone}
                              className="hidden"
                              readOnly
                            />
                            <div className="flex items-center">
                              <div
                                className={`checkbox h-7 w-7 rounded-full flex items-center justify-center border ${
                                  isDone
                                    ? 'bg-main text-white border-main hover:border-main'
                                    : 'border-darkgray hover:border-main'
                                }`}
                                onClick={() => {
                                  const checklistCopy = [...list];
                                  checklistCopy.splice(index, 1, {
                                    key,
                                    description: clDescription,
                                    isDone: !isDone,
                                  });
                                  setChecklist(checklistCopy);
                                }}
                              >
                                <i className="linearicons linearicons-check text-xs font-bold" />
                              </div>

                              <div className="flex-grow relative">
                                <input
                                  type="text"
                                  value={clDescription}
                                  placeholder="Enter to do item title"
                                  className={`block w-full outline-none bg-transparent text-base md:text-lg text-darkgray ml-5 ${
                                    isDone ? 'line-through' : ''
                                  }`}
                                  onChange={(e) => {
                                    const checklistCopy = [...list];
                                    checklistCopy.splice(index, 1, {
                                      key,
                                      isDone,
                                      description: e.target.value,
                                    });
                                    setChecklist(checklistCopy);
                                  }}
                                />
                                <button
                                  type="button"
                                  className="text-red-500 text-3xl font-bold absolute top-[-3px] right-0 hover:text-red-600"
                                  title="Remove"
                                  onClick={() => {
                                    const checklistCopy = [...list];
                                    checklistCopy.splice(index, 1);
                                    setChecklist(checklistCopy);
                                  }}
                                >
                                  &times;
                                </button>
                              </div>
                            </div>

                            {checklistItemIsDuplicate(clDescription, index) && (
                              <small className="text-red-500 font-medium">
                                Duplicate checklist item.
                              </small>
                            )}
                          </li>
                        ),
                      )}
                    </ul>

                    <div>
                      <button
                        type="button"
                        className="mt-12 px-5 py-2 rounded-lg text-main border-2 border-main"
                        onClick={() => {
                          const list = [...checklist];
                          list.push({
                            key: Date.now(),
                            isDone: false,
                            description: '',
                          });
                          setChecklist(list);
                        }}
                      >
                        Add to do
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </main>
      )}
    </>
  );
};

TaskDescriptionPage.layout = 'app';

export default TaskDescriptionPage;
