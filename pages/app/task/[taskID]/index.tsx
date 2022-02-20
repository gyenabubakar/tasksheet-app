import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import {
  DropdownItem,
  PageWithLayout,
  TaskPriority,
  TaskPriorityColour,
} from '~/assets/ts/types';
import notify from '~/assets/ts/notify';
import Navigation from '~/components/common/Navigation';
import iconPeople from '~/assets/icons/task/people.svg';
import iconWorkspace from '~/assets/icons/task/workspace.svg';
import iconFolder from '~/assets/icons/task/folder.svg';
import iconCalendar from '~/assets/icons/task/calendar.svg';
import iconFlag from '~/assets/icons/task/flag.svg';
import iconProgress from '~/assets/icons/task/progress.svg';
import ReactTooltip from 'react-tooltip';
import DropdownMultiple from '~/components/workspace/DropdownMultiple';
import dynamic from 'next/dynamic';
import moment from 'moment';
import Link from 'next/link';
import calculateTimeLeft from '~/assets/ts/calculateTimeLeft';
import hexToRGB from '~/assets/ts/hexToRGB';

const TaskDescriptionEditor = dynamic(
  () => import('~/components/workspace/TaskDescriptionEditor'),
  {
    ssr: false,
  },
);

type TabType = 'Description' | 'Checklist';

interface ChecklistItem {
  id: string | number;
  description: string;
  isDone: boolean;
}

interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface TaskInfo {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  workspace: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    name: string;
    colour: string;
  };
  assignees: Assignee[];
  checklist: ChecklistItem[];
}

const assigneesToDropdownItems = (assignees: Assignee[]): DropdownItem[] => {
  return assignees.map(({ id, name, avatar }) => ({
    id,
    value: (
      <div className="flex items-center">
        <div className="h-8 w-8 relative rounded-full overflow-hidden mr-3 ring-2 ring-white">
          <Image src={avatar} alt={name} layout="fill" />
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

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('Description');

  const [task, setTask] = useState<TaskInfo>({
    id: '1',
    title: 'Develop FAQs page',
    description: '[]',
    dueDate: moment().add(3, 'days').toJSON(),
    priority: TaskPriority.High,
    workspace: {
      id: '1',
      name: 'Front-end Stuff',
    },
    folder: {
      id: '2',
      name: 'React Projects',
      colour: '#14CC8A',
    },
    assignees: [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
    ],
    checklist: [
      {
        id: '1',
        isDone: true,
        description: 'Todo 1',
      },
      {
        id: '2',
        isDone: false,
        description: 'Todo 2',
      },
    ],
  });

  const {
    title,
    description,
    dueDate,
    priority,
    workspace,
    folder,
    checklist,
    assignees,
  } = task;

  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

  const isDescriptionTab = activeTab === 'Description';
  const isChecklistTab = activeTab === 'Checklist';

  const timeLeft =
    calculateTimeLeft(moment(), moment(dueDate)) === 'Overdue'
      ? 'Overdue'
      : calculateTimeLeft(moment(), moment(dueDate));

  function changeTodoStatus(todo: ChecklistItem, index: number) {
    const checklistCopy = [...checklist];
    checklistCopy.splice(index, 1, {
      id: todo.id,
      description: todo.description,
      isDone: !todo.isDone,
    });
    setTask((prevTask) => ({
      ...prevTask,
      checklist: checklistCopy,
    }));

    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(todo);

      notify(`To-do marked as ${!todo.isDone ? 'done' : 'undone'}!`, {
        type: 'success',
      });
    }, 2000);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>{taskID} · TaskSheet</title>
      </Head>

      <Navigation />

      <main className="page-new-task">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="name">
            <h1 className="text-3xl font-bold">{title}</h1>
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
                  <Link href={`/app/workspaces/${workspace.id}`}>
                    <a style={{ color: folder.colour }}>{workspace.name}</a>
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
                  <Link href={`/app/folder/${folder.id}`}>
                    <a style={{ color: folder.colour }}>{folder.name}</a>
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
                              alt={assignee.name}
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
                                : assignee.name}
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
                  options={assigneesToDropdownItems(assignees)}
                  value={assigneesToDropdownItems(assignees)}
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
                    {moment(dueDate).format('D MMM, YYYY @ hh:mm A')}
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
                  <span style={{ color: TaskPriorityColour[priority] }}>
                    {priority}
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
                          backgroundColor: folder.colour,
                          left: `${80}%`,
                        }}
                      />

                      <div
                        className="bar-inner absolute h-full rounded-l-full"
                        style={{
                          width: `${80 + 0.3}%`,
                          backgroundColor: folder.colour,
                        }}
                      />

                      <div
                        className="bar w-full h-2 rounded-full overflow-hidden relative opacity-25"
                        style={{
                          backgroundColor: `rgba(${hexToRGB(
                            folder.colour,
                          )!.rgb()}, 0.8)`,
                        }}
                      />
                    </div>

                    <span className="text-gray-600 ml-3">80%</span>
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
                  <TaskDescriptionEditor value={description} readOnly />
                </div>
              )}

              {isChecklistTab && (
                <div className="checklist-tab mt-10">
                  <ul>
                    {checklist.map(
                      ({ id, isDone, description: clDescription }, index) => (
                        <li key={id} className="flex items-center mb-4">
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
                            onClick={() =>
                              changeTodoStatus(
                                {
                                  id,
                                  isDone,
                                  description: clDescription,
                                },
                                index,
                              )
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
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

TaskDescriptionPage.layout = 'app';

export default TaskDescriptionPage;
