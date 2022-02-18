import Head from 'next/head';
import React, {
  FormEvent,
  forwardRef,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react';
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

const TaskDescriptionEditor = dynamic(
  () => import('~/components/workspace/TaskDescriptionEditor'),
  {
    ssr: false,
  },
);

interface Assignee extends DropdownItem {
  avatar: string;
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

type DatePickerInputProps = {
  value?: Date | null;
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
};

const DatePickerInput = forwardRef(
  ({ value, onClick }: DatePickerInputProps, ref: Ref<HTMLButtonElement>) => (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      className="text-main text-sm md:text-base font-medium hover:text-darkmain"
    >
      {value}
    </button>
  ),
);

const NewTaskPage: PageWithLayout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityDropdownItem | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [workspace, setWorkspace] = useState<Assignee | null>(null);
  const [folder, setFolder] = useState<Folder | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const [showPriorityDropdow, setShowPriorityDropdow] = useState(false);

  const dateRef = useRef<Date | null>(null);

  const isDescriptionTab = activeTab === 'Description';
  const isChecklistTab = activeTab === 'Checklist';

  const nameIsValid = title ? title.length >= 2 && title.length < 120 : null;
  const workspaceIsValid = workspace !== null;
  const folderIsValid = folder !== null;

  const workspaces: DropdownItem[] = [
    {
      id: 1,
      value: 'React Projects',
      searchable: 'React Projects',
    },
    {
      id: 2,
      value: 'Freelance',
      searchable: 'Freelance',
    },
    {
      id: 3,
      value: 'Open Source',
      searchable: 'Open Source',
    },
  ];

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

  const members: Assignee[] = [
    {
      id: '1',
      searchable: 'De Graft Arthur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      value: (
        <div className="flex items-center">
          <div className="h-8 w-8 relative rounded-full overflow-hidden mr-3 ring-2 ring-white">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="De Graft Arthur"
              layout="fill"
            />
          </div>

          <span>De Graft Arthur</span>
        </div>
      ),
    },
    {
      id: '2',
      value: (
        <div className="flex items-center">
          <div className="h-8 w-8 relative rounded-full overflow-hidden mr-3 ring-2 ring-white">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="De Graft Arthur"
              layout="fill"
            />
          </div>

          <span>De Graft Arthur</span>
        </div>
      ),
      searchable: 'Gyen Abubakar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '3',
      value: (
        <div className="flex items-center">
          <div className="h-8 w-8 relative rounded-full overflow-hidden mr-3 ring-2 ring-white">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="De Graft Arthur"
              layout="fill"
            />
          </div>

          <span>De Graft Arthur</span>
        </div>
      ),
      searchable: 'Felix Amoako',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
  ];

  const folders: Folder[] = [
    {
      id: '1',
      searchable: 'Mobile Apps',
      colour: '#5C68FF',
      value: (
        <div className="flex items-center">
          <div
            className="h-6 w-6 relative rounded-full overflow-hidden mr-3 ring-2 ring-white"
            style={{ backgroundColor: '#5C68FF' }}
          />

          <span>Mobile Apps</span>
        </div>
      ),
    },
    {
      id: '2',
      searchable: '3D Animations',
      colour: '#14CC8A',
      value: (
        <div className="flex items-center">
          <div
            className="h-6 w-6 relative rounded-full overflow-hidden mr-3 ring-2 ring-white"
            style={{ backgroundColor: '#14CC8A' }}
          />

          <span>3D Animations</span>
        </div>
      ),
    },
    {
      id: '3',
      searchable: 'Blog Articles',
      colour: '#e11d48',
      value: (
        <div className="flex items-center">
          <div
            className="h-6 w-6 relative rounded-full overflow-hidden mr-3 ring-2 ring-white"
            style={{ backgroundColor: '#e11d48' }}
          />

          <span>Blog Articles</span>
        </div>
      ),
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

  function onCreateNewTask() {
    if (!submitting) {
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

      const unfinishedTodoItem = checklist.find((item) => !item.description);
      if (checklist.length && unfinishedTodoItem) {
        notify('Remove empty to-dos from checklist.', {
          type: 'error',
        });
        return;
      }

      const form = {
        title,
        description,
        workspace: workspace?.id,
        folder: folder?.id || null,
        assignees: assignees.map((a) => a.id),
        dueDate: dateRef.current?.toJSON() || null,
        checklist: checklist.map(({ isDone, description: desc }) => ({
          isDone,
          description: desc,
        })),
        priority: priority?.value || null,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
      }, 2000);
    }
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                onChange={(e) => setTitle(e.target.value)}
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
                      className="text-main hover:text-darkmain"
                      onClick={() =>
                        setShowWorkspaceDropdown((prevState) => !prevState)
                      }
                    >
                      Select
                    </button>
                  )}
                </div>

                {showWorkspaceDropdown && (
                  <Dropdown
                    id="workspaces-dropdown"
                    options={workspaces}
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
                      className="text-main hover:text-darkmain"
                      onClick={() => handleSelectFolder()}
                    >
                      Select
                    </button>
                  )}
                </div>

                {showFolderDropdown && (
                  <Dropdown
                    id="workspaces-dropdown"
                    options={folders}
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
                            className="h-8 w-8 rounded-full ring-2 ring-white inline-block overflow-hidden relative"
                          >
                            <Image
                              src={assignee.avatar}
                              alt={assignee.searchable}
                              layout="fill"
                            />

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
                  </div>
                </div>
              </div>

              {showMembersDropdown && (
                <DropdownMultiple
                  id="assignees-dropdown"
                  options={members}
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
                      dateRef.current = date;
                    }}
                    timeFormat="hh:mm aa"
                    dateFormat="MMM d, yyyy @ h:mm aa"
                    minDate={new Date()}
                    filterTime={(date) => date.getTime() > new Date().getTime()}
                    customInput={<DatePickerInput value={selectedDate} />}
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
                          setShowPriorityDropdow(true);
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
                        setShowPriorityDropdow((prevState) => !prevState)
                      }
                    >
                      Select
                    </button>
                  )}
                </div>

                {showPriorityDropdow && (
                  <Dropdown
                    id="priorities-dropdown"
                    options={priorities}
                    value={priority}
                    className="absolute left-[0px] top-[30px]"
                    showSearchField={false}
                    onSelect={(item) => setPriority(item)}
                    onClose={() => setShowPriorityDropdow(false)}
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
                <div className="checklist-tab">
                  <ul>
                    {checklist.map(
                      (
                        { key, isDone, description: clDescription },
                        index,
                        list,
                      ) => (
                        <li key={key} className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            checked={isDone}
                            className="hidden"
                            readOnly
                          />
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
                        </li>
                      ),
                    )}
                  </ul>

                  <div className="text-right">
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
