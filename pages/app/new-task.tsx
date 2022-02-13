import Head from 'next/head';
import React, { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';

import { DropdownItem, PageWithLayout, TaskPriority } from '~/assets/ts/types';
import Navigation from '~/components/common/Navigation';
import iconPeople from '~/assets/icons/task/people.svg';
import iconWorkspace from '~/assets/icons/task/workspace.svg';
import Dropdown from '~/components/workspace/Dropdown';
import DropdownMultiple from '~/components/workspace/DropdownMultiple';
import ReactTooltip from 'react-tooltip';

interface Assignee extends DropdownItem {
  avatar: string;
}

const NewTaskPage: PageWithLayout = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [dueDate, setDueDate] = useState<number | null>(null);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [workspace, setWorkspace] = useState<Assignee | null>(null);
  const [folderID, setFolderID] = useState<string | null>(null);

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);

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
    {
      id: '4',
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
      searchable: 'James Otabie',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '5',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '6',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '7',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '8',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '9',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '10',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
    {
      id: '11',
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
      searchable: 'Bismark Biney',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    },
  ];

  function onCreateNewTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = {
      name,
      description,
      priority,
      dueDate,
      assignees,
      checklist,
      workspace,
      folderID,
    };

    // eslint-disable-next-line no-console
    console.log(form);
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
        <form onSubmit={onCreateNewTask}>
          <div className="name">
            <br />
            <div className="input-container relative">
              <input
                type="text"
                id="task-name"
                minLength={1}
                required
                className="bg-transparent border-0 text-3xl outline-0 font-bold w-full my-3 block"
                onChange={(e) => setName(e.target.value)}
              />

              <label
                htmlFor="task-name"
                className="text-3xl font-bold absolute cursor-text"
              >
                Enter task name...
              </label>
            </div>
            <small className="text-red font-medium text-red-500">
              Name must be between 2 and 120 characters long.
            </small>
          </div>

          <div className="details mt-5">
            <div className="workspace grid grid-cols-5 mb-5">
              <div className="flex items-center">
                <div className="icon flex items-center relative h-7 w-7">
                  <Image src={iconWorkspace} layout="fill" priority />
                </div>

                <span className="text-darkgray text-xl font-medium ml-3">
                  Workspace
                </span>
              </div>

              <div className="ml-10 relative">
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
                    Select workspace
                  </button>
                )}

                {showWorkspaceDropdown && (
                  <Dropdown
                    id="workspaces-dropdown"
                    options={workspaces}
                    value={workspace}
                    className="absolute -left-[45vw] md:left-auto"
                    onSelect={(item) => setWorkspace(item)}
                    onClose={() => setShowWorkspaceDropdown(false)}
                  />
                )}
              </div>
            </div>

            <div className="assignees grid grid-cols-5">
              <div className="flex items-center">
                <div className="icon relative h-7 w-7">
                  <Image src={iconPeople} layout="fill" priority />
                </div>

                <span className="text-darkgray text-xl font-medium ml-3">
                  Assign to
                </span>
              </div>

              <div className="ml-10 col-start-2 col-end-6 relative">
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
                    onClick={() =>
                      setShowMembersDropdown((prevState) => !prevState)
                    }
                  >
                    +
                  </button>
                </div>

                {showMembersDropdown && (
                  <DropdownMultiple
                    id="assignees-dropdown"
                    options={members}
                    value={assignees}
                    className="absolute mt-3 -left-[45vw] md:left-auto"
                    onSelect={(items) => setAssignees(items)}
                    onClose={() => setShowMembersDropdown(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

NewTaskPage.layout = 'app';

export default NewTaskPage;
