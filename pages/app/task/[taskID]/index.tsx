import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useSWR from 'swr';
import {
  doc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import ReactTooltip from 'react-tooltip';
import dynamic from 'next/dynamic';
import moment from 'moment';
import Link from 'next/link';
import { v4 as uuid } from 'uuid';

import {
  DropdownItem,
  PageWithLayout,
  TaskPriorityColour,
} from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import iconPeople from '~/assets/icons/task/people.svg';
import iconWorkspace from '~/assets/icons/task/workspace.svg';
import iconFolder from '~/assets/icons/task/folder.svg';
import iconCalendar from '~/assets/icons/task/calendar.svg';
import iconFlag from '~/assets/icons/task/flag.svg';
import iconProgress from '~/assets/icons/task/progress.svg';
import DropdownMultiple from '~/components/workspace/DropdownMultiple';
import calculateTimeLeft from '~/assets/ts/calculateTimeLeft';
import hexToRGB from '~/assets/ts/hexToRGB';
import { getTask } from '~/assets/fetchers/task';
import {
  NotificationType,
  TaskAssignee,
  TaskChecklistItem,
  TaskModel,
  TaskStatusChangedNotification,
} from '~/assets/firebase/firebaseTypes';
import useUser from '~/hooks/useUser';
import Loading from '~/components/common/Loading';
import ErrorFallback from '~/components/common/ErrorFallback';

const TaskDescriptionEditor = dynamic(
  () => import('~/components/workspace/TaskDescriptionEditor'),
  {
    ssr: false,
  },
);

type TabType = 'Description' | 'Checklist';

const assigneesToDropdownItems = (
  assignees: TaskAssignee[],
): DropdownItem[] => {
  return assignees.map(({ uid, name, avatar }) => ({
    id: uid,
    value: (
      <div className="flex items-center">
        <div className="h-8 w-8 relative rounded-full bg-main overflow-hidden mr-3 ring-2 ring-white">
          {avatar && <Image src={avatar} alt={name} layout="fill" />}
        </div>

        <span>{name}</span>
      </div>
    ),
    searchable: name,
  }));
};

const TaskDescriptionPage: PageWithLayout = () => {
  const router = useRouter();
  const { taskID } = router.query;
  const { user } = useUser();

  const { error, data: fetchedTask } = useSWR(
    'get-task-info',
    getTask(taskID as string),
  );

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');

  const [task, setTask] = useState<TaskModel | undefined>(undefined);

  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  const isDescriptionTab = activeTab === 'Description';
  const isChecklistTab = activeTab === 'Checklist';

  const timeLeft = (() => {
    if (task?.dueDate) {
      return calculateTimeLeft(moment(), moment(task.dueDate)) === 'Overdue'
        ? 'Overdue'
        : `${calculateTimeLeft(moment(), moment(task.dueDate))} left`;
    }
    return 'N/A';
  })();

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

  function notifyAssignees(isCompleted: boolean) {
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
          notifyAssignees(isCompleted);
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
          notifyAssignees(allItemsAreChecked);
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
    const unsubscribe = listenForChanges();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTask(fetchedTask);
  }, [fetchedTask]);

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
                ? 'bg-gray-500 hover:bg-gray-600'
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

      {!task && !error && (
        <Loading loadingText="Loading task..." className="mt-12" />
      )}

      {error && !task && (
        <ErrorFallback title={error.title} message={error.message} />
      )}

      {task && !error && (
        <main className="page-new-task">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="name">
              <span
                className={`status-badge text-sm font-medium text-white px-2 py-1 rounded-md cursor-default ${
                  !task.isCompleted ? 'bg-gray-500' : 'bg-green-500'
                }`}
              >
                {!task.isCompleted ? 'In Progress' : 'Completed'}
              </span>
              <h1 className="text-3xl font-bold">{task.title}</h1>
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
                      <a style={{ color: task.folder.colour }}>
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
                    <Link href={`/app/folder/${task.folder.id}`}>
                      <a style={{ color: task.folder.colour }}>
                        {task.folder.title}
                      </a>
                    </Link>
                  </div>
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
                        {task.assignees.slice(0, 6).map((assignee, index) => (
                          <div key={assignee.uid} className="flex items-center">
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
                                />
                              )}

                              {task.assignees.length > 6 && index === 5 && (
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {showMembersDropdown && (
                  <DropdownMultiple
                    id="assignees-dropdown"
                    options={assigneesToDropdownItems(task.assignees)}
                    value={assigneesToDropdownItems(task.assignees)}
                    readOnly
                    className="absolute mt-3 left-0 top-[30px]"
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
                    <span
                      data-tip
                      data-for="due-date"
                      className={`text-sm md:text-base ${
                        timeLeft === 'Overdue' ? 'text-red-600' : ''
                      }`}
                    >
                      {task.dueDate
                        ? moment(task.dueDate).format('D MMM, YYYY @ hh:mm A')
                        : 'N/A'}
                    </span>
                    {isMounted && (
                      <ReactTooltip
                        id="due-date"
                        place="top"
                        type="dark"
                        effect="solid"
                      >
                        {timeLeft}
                      </ReactTooltip>
                    )}
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
                    <span
                      style={{
                        color: task.priority
                          ? TaskPriorityColour[task.priority]
                          : '#7a7a7a',
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="progress-wrapper relative">
                <div className="progress grid grid-cols-7 lg:grid-cols-5 mb-5">
                  <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                    <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                      <Image src={iconProgress} layout="fill" priority />
                    </div>

                    <span className="text-darkgray md:text-xl font-medium ml-3">
                      Progress
                    </span>
                  </div>

                  <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                    <div className="flex items-center">
                      <div className="progress-bar w-[200px] relative max-w-[200px]">
                        <div
                          className="point absolute w-4 h-4 rounded-full -top-1"
                          style={{
                            backgroundColor: task.folder.colour,
                            left: `${getProgressPercent() - 2}%`,
                          }}
                        />

                        <div
                          className="bar-inner absolute h-full rounded-l-full"
                          style={{
                            width: `${getProgressPercent() + 0.5}%`,
                            backgroundColor: task.folder.colour,
                          }}
                        />

                        <div
                          className="bar w-full h-2 rounded-full overflow-hidden relative opacity-25"
                          style={{
                            backgroundColor: `rgba(${hexToRGB(
                              task.folder.colour,
                            )!.rgb()}, 0.8)`,
                          }}
                        />
                      </div>

                      <span className="text-gray-600 text-sm  ml-5">
                        {getProgressPercent()}%
                      </span>
                    </div>
                  </div>
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
                    <TaskDescriptionEditor value={task.editorjsData} readOnly />
                  </div>
                )}

                {isChecklistTab && (
                  <div className="checklist-tab mt-10">
                    <ul>
                      {task.checklist.map((_checklistItem, index) => {
                        const { isDone, description: clDescription } =
                          _checklistItem;

                        return (
                          <li
                            key={clDescription}
                            className="flex items-center mb-4"
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              className="hidden"
                              readOnly
                            />

                            <div
                              className={`checkbox h-7 w-[1.9rem] rounded-full flex items-center justify-center border ${
                                isDone
                                  ? 'bg-main text-white border-main hover:border-main'
                                  : 'border-darkgray hover:border-main'
                              }`}
                              onClick={() =>
                                changeTodoStatus(_checklistItem, index)
                              }
                            >
                              <i className="linearicons linearicons-check text-xs font-bold" />
                            </div>

                            <div
                              className={`flex-grow w-full text-base md:text-lg text-darkgray ml-5 ${
                                isDone ? 'line-through' : ''
                              }`}
                            >
                              {clDescription}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
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
