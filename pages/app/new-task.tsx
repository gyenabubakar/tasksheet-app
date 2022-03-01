import Head from 'next/head';
import React, { FormEvent, forwardRef, Ref, useEffect, useState } from 'react';
import Image from 'next/image';
import ReactTooltip from 'react-tooltip';
import DatePicker from 'react-datepicker';
import dynamic from 'next/dynamic';

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
import Dropdown from '~/components/workspace/Dropdown';
import DropdownMultiple from '~/components/workspace/DropdownMultiple';
import notify from '~/assets/ts/notify';
import Container from '~/components/common/Container';
import Button from '~/components/common/Button';
import useUser from '~/hooks/useUser';
import useSWR from 'swr';
import { getMembers, getWorkspaces } from '~/assets/fetchers/workspace';
import swal from '~/assets/ts/sweetalert';
import { useRouter } from 'next/router';
import {
  FolderModel,
  InviteAcceptedNotification,
  MemberJoinedNotification,
  NotificationType,
  TaskAssignedNotification,
  TaskModel,
  UserModel,
} from '~/assets/firebase/firebaseTypes';
import { getFolders } from '~/assets/fetchers/folder';
import alertDBError from '~/assets/firebase/alertDBError';
import moment from 'moment';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

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

interface PriorityDropdownItem extends DropdownItem {
  id: TaskPriority;
  value: TaskPriority;
}

interface ChecklistItem {
  key: string | number;
  description: string;
  isDone: boolean;
}

type TabType = 'Description' | 'Checklist';

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

const NewTaskPage: PageWithLayout = () => {
  const router = useRouter();
  const { user } = useUser();
  const { error: workspacesError, data: workspaces } = useSWR(
    'get-user-workspaces',
    getWorkspaces(user.uid),
  );

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');
  const [submitting, setSubmitting] = useState(false);

  const [folders, setFolders] = useState<FolderModel[] | null>(null);
  const [members, setMembers] = useState<UserModel[] | null>(null);

  const [gettingFolders, setGettingFolders] = useState(false);
  const [gettingMembers, setGettingMembers] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('[]');
  const [priority, setPriority] = useState<PriorityDropdownItem | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [workspace, setWorkspace] = useState<DropdownItem | null>(null);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const isDescriptionTab = activeTab === 'Description';
  const isChecklistTab = activeTab === 'Checklist';

  const nameIsValid = title ? title.length >= 2 && title.length < 120 : null;
  const workspaceIsValid = workspace !== null;
  const folderIsValid = folder !== null;

  const dropdownWorkspaces: DropdownItem[] = workspaces
    ? workspaces.map(({ id, name }) => ({
        id,
        value: name,
        searchable: name,
      }))
    : [];

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
          searchable: name,
          avatar,
          value: (
            <div className="flex items-center">
              {avatar && (
                <div className="h-8 w-8 relative rounded-full overflow-hidden mr-3 ring-2 ring-white">
                  <Image src={avatar} alt={name} priority layout="fill" />
                </div>
              )}
              {!avatar && (
                <div className="h-8 w-8 relative rounded-full bg-main mr-3 ring-2 ring-white" />
              )}

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

  function handleSelectFolder() {
    if (!workspace) {
      notify('Workspace is required.', {
        type: 'info',
      });
      return;
    }

    setShowFolderDropdown((prevState) => !prevState);
  }

  function handleSelectAssignees() {
    if (!workspace) {
      notify('Workspace is required.', {
        type: 'info',
      });
      return;
    }

    setShowMembersDropdown((prevState) => !prevState);
  }

  function checklistItemIsDuplicate(itemDescription: string, index: number) {
    return (
      itemDescription &&
      checklist
        .filter((_, i) => i !== index)
        .some(
          (item) =>
            item.description.toLowerCase().trim() ===
            itemDescription.toLowerCase().trim(),
        )
    );
  }

  function hasDuplicateChecklistItems() {
    const items = checklist.map((item) => item.description);
    const uniqueItems = new Set(items);
    return items.length !== uniqueItems.size;
  }

  function notifyAssignees(task: TaskModel) {
    if (assignees.length) {
      const db = getFirestore();
      const batch = writeBatch(db);

      assignees
        .filter((assignee) => assignee.id !== user.uid)
        .forEach((assignee) => {
          const assigneeNotifRef = doc(
            db,
            `users/${assignee.id}`,
            `notifications`,
            uuid(),
          );

          batch.set(assigneeNotifRef, {
            type: NotificationType.TaskAssigned,
            readAt: null,
            message: `${user.displayName} assigned you to the task: ${title}.`,
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
        });

      batch.commit();
    }
  }

  async function onCreateNewTask() {
    if (!submitting && workspace && folder) {
      if (!nameIsValid) {
        notify('Task title is required.', {
          type: 'error',
        });
        return;
      }

      if (!workspaceIsValid) {
        notify('Workspace is required.', {
          type: 'error',
        });
        return;
      }

      if (!folderIsValid) {
        notify('Folder is required.', {
          type: 'error',
        });
        return;
      }

      if (selectedDate) {
        const diff = moment(selectedDate).diff(moment(), 'minutes');
        if (diff < 5) {
          const text = (() => {
            if (diff < 0) {
              return `It's ${diff
                .toString()
                .slice(1)} minutes pass the due date.`;
            }
            if (diff > 0) {
              return `The task is due in ${diff} minutes.`;
            }

            return `The task is due right now.`;
          })();

          swal({
            icon: 'warning',
            title: "The due date doesn't seem right. 🤔",
            text,
            confirmButtonText: 'Change date',
          }).finally(() => {});
          return;
        }
      }

      const unfinishedTodoItem = checklist.find((item) => !item.description);
      if (checklist.length && unfinishedTodoItem) {
        notify('Remove empty to-dos from checklist.', {
          type: 'error',
        });
        return;
      }

      if (hasDuplicateChecklistItems()) {
        notify('Checklist has duplicate items.', {
          type: 'error',
        });
        return;
      }

      try {
        setSubmitting(true);
        const targetFolder = folders!.find((f) => f.id === folder.id)!;
        const targetMembers = assignees
          .map((a) => ({
            uid: a.id,
            name: a.searchable! === 'Me' ? user.displayName! : a.searchable!,
            avatar: a.avatar,
          }))
          .sort((a, b) => {
            if (a.uid === user.uid) return -1;
            if (b.uid !== user.uid) return 1;
            return 0;
          });
        const checklistItems = checklist.map(
          ({ isDone, description: desc }) => ({
            isDone,
            description: desc,
          }),
        );

        // const checklistComplete = (() => {
        //   let isComplete = true
        //   checklistItems.forEach(item => {
        //     isComplete = isComplete && item.isDone
        //   })
        //   return isComplete
        // })

        const form: TaskModel = {
          title,
          editorjsData: description,
          description: '',
          workspace: {
            id: workspace.id,
            name: workspace.searchable!,
          },
          folder: {
            id: targetFolder.id!,
            title: targetFolder.title,
            colour: targetFolder.colour,
          },
          assignees: targetMembers,
          dueDate: selectedDate?.toJSON() || null,
          priority: priority?.id || null,
          checklist: checklistItems,
          createdBy: {
            uid: user.uid,
            name: user.displayName!,
            avatar: user.photoURL,
          },
          isCompleted: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const tasksCollRef = collection(getFirestore(), 'tasks');
        const taskResponse = await addDoc(tasksCollRef, form);
        notify('Task created!', {
          type: 'success',
        });
        notifyAssignees(form);
        await router.push(`/app/task/${taskResponse.id}`);
      } catch (err: any) {
        alertDBError(err, "Couldn't create workspace.").then(() => {
          setSubmitting(false);
        });
      }
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (workspaces) {
      if (!workspaces.length) {
        swal({
          icon: 'warning',
          title: "You can't create a task.",
          text: "This is because you're not an owner or member of any workspace.",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Create workspace',
          cancelButtonText: 'Cancel',
        }).then(async ({ isConfirmed }) => {
          if (isConfirmed) {
            await router.push(`/app/workspaces/new-workspace`);
            return;
          }
          await router.push('/app/');
        });
      }
    }
  }, [workspaces]);

  useEffect(() => {
    if (workspace) {
      setGettingFolders(true);
      getFolders(workspace.id)()
        .then((_folders) => {
          if (!_folders.length) {
            swal({
              icon: 'warning',
              title: "You can't create a task.",
              html: (
                <span>
                  This is because there are no folders in the workspace you
                  selected. Please inform an admin of&nbsp;
                  <span className="text-main">{workspace.searchable}</span>
                  &nbsp;to create a folder for you, or create it yourself if
                  you&apos;re an admin.
                </span>
              ),
              showConfirmButton: true,
            }).then(async () => {
              await router.push(`/app/workspaces/${workspace.id}`);
            });
          }
          setFolders(_folders);
        })
        .catch(async (err) => {
          await alertDBError(
            err,
            `Couldn't get folders in ${workspace.searchable}`,
          );
        })
        .finally(() => {
          setGettingFolders(false);
        });

      setGettingMembers(true);
      getMembers(workspace.id, user)()
        .then((_members) => {
          setMembers([..._members]);
        })
        .catch(async (err) => {
          await alertDBError(
            err,
            `Failed to get members of ${workspace.searchable}.`,
          );
        })
        .finally(() => {
          setGettingMembers(false);
        });
    }
  }, [workspace]);

  return (
    <>
      <Head>
        <title>Create New Task · TaskSheet</title>
      </Head>

      <Navigation />

      <main className="page-new-task">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="name">
            <br />
            <div className="input-container relative">
              <input
                type="text"
                id="task-name"
                minLength={1}
                required
                autoComplete="off"
                className="bg-transparent border-0 text-xl md:text-3xl outline-0 font-bold w-full my-3 block"
                onChange={(e) => setTitle(e.target.value.trim())}
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
                  {workspace && (
                    <div className="flex items-center">
                      <span>{workspace.searchable}</span>
                      <button
                        className="text-2xl text-red-500 font-bold ml-3"
                        onClick={() => {
                          setWorkspace(null);
                          setShowWorkspaceDropdown(true);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {!workspace && (
                    <button
                      id="workspaces-dropdown-button"
                      type="button"
                      className="text-main hover:text-darkmain flex items-center"
                      onClick={() => {
                        if (workspaces) {
                          setShowWorkspaceDropdown((prevState) => !prevState);
                        }
                      }}
                    >
                      <span>Select</span>
                      {!workspacesError && !workspaces && (
                        <svg
                          className="animate-spin h-4 w-4 text-white ml-3"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          data-tip
                          data-for="workspaces-loading"
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
                          id="workspaces-loading"
                          place="top"
                          type="dark"
                          effect="solid"
                        >
                          Getting your workspaces
                        </ReactTooltip>
                      )}
                    </button>
                  )}
                </div>

                {showWorkspaceDropdown && (
                  <Dropdown
                    id="workspaces-dropdown"
                    options={dropdownWorkspaces}
                    value={workspace}
                    className="absolute left-[0px] top-[30px]"
                    onSelect={(item) => setWorkspace(item)}
                    onClose={() => setShowWorkspaceDropdown(false)}
                  />
                )}
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
                  {folder && (
                    <div className="flex items-center">
                      <span>{folder.searchable}</span>
                      <button
                        className="text-2xl text-red-500 font-bold ml-3"
                        onClick={() => {
                          setFolder(null);
                          setShowFolderDropdown(true);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {!folder && (
                    <button
                      id="workspaces-dropdown-button"
                      type="button"
                      className="text-main hover:text-darkmain flex items-center"
                      onClick={() => handleSelectFolder()}
                    >
                      <span>Select</span>
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
                    value={folder}
                    className="absolute left-[0px] top-[30px]"
                    onSelect={(item) => setFolder(item)}
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
                      {assignees.slice(0, 6).map((assignee, index) => (
                        <div key={assignee.id} className="flex items-center">
                          <div
                            data-tip
                            data-for={`assignee-${assignee.id}`}
                            key={assignee.id}
                            className="h-8 w-8 rounded-full bg-main ring-2 ring-white inline-block overflow-hidden relative"
                          >
                            {assignee.avatar && (
                              <Image
                                src={assignee.avatar}
                                alt={assignee.searchable}
                                layout="fill"
                                priority
                              />
                            )}

                            {assignees.length > 6 && index === 5 && (
                              <div
                                className="overlay absolute h-full w-full bg-black opacity-70 text-white text-sm font-medium flex items-center justify-center cursor-pointer"
                                onClick={() =>
                                  setShowMembersDropdown(
                                    (prevState) => !prevState,
                                  )
                                }
                              >
                                +{assignees.length - 5}
                              </div>
                            )}
                          </div>

                          {isMounted && (
                            <ReactTooltip
                              id={`assignee-${assignee.id}`}
                              place="top"
                              type="dark"
                              effect="solid"
                            >
                              {index === 5
                                ? `${assignees.length - 5} more`
                                : assignee.searchable}
                            </ReactTooltip>
                          )}
                        </div>
                      ))}
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
                  value={assignees}
                  className="absolute mt-3 left-0 top-[30px]"
                  onSelect={(items) => setAssignees(items)}
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
                    filterTime={(date) => date.getTime() > new Date().getTime()}
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

            <div className="folder-wrapper relative">
              <div className="folder grid grid-cols-7 lg:grid-cols-5 mb-5">
                <div className="col-start-1 col-end-4 lg:col-end-2 flex items-center">
                  <div className="icon flex items-center relative h-5 w-5 lg:h-7 lg:w-7">
                    <Image src={iconFlag} layout="fill" priority />
                  </div>

                  <span className="text-darkgray md:text-xl font-medium ml-3">
                    Priority
                  </span>
                </div>

                <div className="col-start-4 col-end-8 lg:col-start-2 lg:col-end-6 relative">
                  {priority && (
                    <div className="flex items-center">
                      <span
                        style={{ color: TaskPriorityColour[priority.value] }}
                      >
                        {priority.value}
                      </span>
                      <button
                        className="text-2xl text-red-500 font-bold ml-3"
                        onClick={() => {
                          setPriority(null);
                          setShowPriorityDropdown(true);
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {!priority && (
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
                    value={priority}
                    className="absolute left-[0px] top-[30px]"
                    showSearchField={false}
                    onSelect={(item) => setPriority(item)}
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
                    value={description}
                    onChange={(newDesc) => {
                      setDescription(JSON.stringify(newDesc));
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

      <div className="fixed bottom-[15px] md:bottom-[50px] left-0 w-screen z-30">
        <Container className="flex justify-end">
          {/* <button
            className="bg-main text-white font-medium px-8 py-3 rounded-xl flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCreateNewTask}
          >
            Save task
          </button> */}

          <Button
            loading={submitting}
            paddingClasses="px-8 py-3"
            onClick={() => onCreateNewTask()}
          >
            {submitting ? 'Creating task...' : 'Create task'}
          </Button>
        </Container>
      </div>
    </>
  );
};

NewTaskPage.layout = 'app';

export default NewTaskPage;
