import Head from 'next/head';
import React, { ChangeEvent, useState } from 'react';
// import moment from 'moment';
import Image from 'next/image';

import { PageWithLayout, TaskType } from '~/assets/ts/types';
import Input from '~/components/common/Input';
import Task from '~/components/workspace/Task';
import illustrationEmpty from '~/assets/illustrations/empty.svg';
import Button from '~/components/common/Button';
import { useRouter } from 'next/router';

type TabType = 'To do' | 'Done' | 'Overdue';

const TasksPage: PageWithLayout = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('To do');
  const router = useRouter();

  const isTodoTab = activeTab === 'To do';
  const isDoneTab = activeTab === 'Done';
  const isOverdueTab = activeTab === 'Overdue';

  const tasks: TaskType[] = [
    // {
    //   id: '1',
    //   name: 'Build Navbar',
    //   description:
    //     ' Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, dolores minima harum atque temporibus veniam optio in debitis consequatur ducimus quia assumenda error ex distinctio nobis sapiente adipisci aut. Delectus! ',
    //   checkLists: [
    //     {
    //       id: '1',
    //       name: 'Make nav fill screen',
    //       complete: false,
    //     },
    //   ],
    //   dueDate: moment().add(5, 'days'),
    //   members: [
    //     ...(() => {
    //       const members: any[] = [];
    //       for (let i = 0; i < 5; i++) {
    //         members.push({
    //           id: i.toString(),
    //           avatar:
    //             'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //           name: 'De Graft Arthur',
    //         });
    //       }
    //       return members;
    //     })(),
    //   ],
    //   priority: 'High',
    //   folder: {
    //     id: '1',
    //     colour: '#14CC8A',
    //   },
    //   createdBy: {
    //     name: 'Gyen Abubakar',
    //     avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //   },
    // },
    // {
    //   id: '2',
    //   name: 'Improve Signup UX',
    //   description:
    //     ' Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, dolores minima harum atque temporibus veniam optio in debitis consequatur ducimus quia assumenda error ex distinctio nobis sapiente adipisci aut. Delectus! ',
    //   checkLists: [],
    //   dueDate: moment().add(10, 'hours'),
    //   members: [
    //     ...(() => {
    //       const members: any[] = [];
    //       for (let i = 0; i < 10; i++) {
    //         members.push({
    //           id: i.toString(),
    //           avatar:
    //             'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //           name: 'De Graft Arthur',
    //         });
    //       }
    //       return members;
    //     })(),
    //   ],
    //   priority: 'Low',
    //   folder: {
    //     id: '1',
    //     colour: '#5C68FF',
    //   },
    //   createdBy: {
    //     name: 'Gyen Abubakar',
    //     avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //   },
    // },
    // {
    //   id: '3',
    //   name: 'Redesign FAQs page',
    //   description:
    //     'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fuga, dolores minima harum atque temporibus veniam optio in debitis consequatur ducimus quia assumenda error ex distinctio nobis sapiente adipisci aut. Delectus!',
    //   checkLists: [],
    //   dueDate: moment().add(45, 'minutes'),
    //   members: [
    //     ...(() => {
    //       const members: any[] = [];
    //       for (let i = 0; i < 1; i++) {
    //         members.push({
    //           id: i.toString(),
    //           avatar:
    //             'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //           name: 'De Graft Arthur',
    //         });
    //       }
    //       return members;
    //     })(),
    //   ],
    //   priority: 'Urgent',
    //   folder: {
    //     id: '1',
    //     colour: '#AD0033',
    //   },
    //   createdBy: {
    //     name: 'Gyen Abubakar',
    //     avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    //   },
    // },
  ];

  return (
    <>
      <Head>
        <title>Your Tasks · TaskSheet</title>
      </Head>

      <main className="page-app-home">
        <div className="heading">
          <h1 className="text-3xl md:text-[36px] font-bold">
            Howdy, <span className="text-main">Gyen Abubakar</span>!
          </h1>

          <p className="mt-5 text-xl md:text-2xl text-darkgray">
            Let&apos;s get some work done.
          </p>

          <nav className="flex flex-col md:flex-row justify-between mt-12">
            <div className="tabs text-sm md:text-base font-medium flex items-center bg-[#EAEBFF] px-1.5 py-1.5 rounded-[12px] w-full md:w-auto">
              <div
                className={`tab ${isTodoTab ? 'active' : ''}`}
                onClick={() => setActiveTab('To do')}
              >
                To do
              </div>

              <div
                className={`tab ${isDoneTab ? 'active' : ''}`}
                onClick={() => setActiveTab('Done')}
              >
                Done
              </div>

              <div
                className={`tab ${isOverdueTab ? 'active' : ''}`}
                onClick={() => setActiveTab('Overdue')}
              >
                <span>Overdue</span>
                <span className="important ml-2 inline-block" />
              </div>
            </div>

            <div className="search mt-3">
              <Input
                id="search-keyword"
                type="text"
                value={searchKeyword}
                wrapperClass="mx-auto md:mx-0"
                icon={{
                  position: searchKeyword ? 'both' : 'left',
                  elements: [
                    <div className=" absolute bottom-[1.1rem] left-[1.125rem]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.66465 0.045166C3.89415 0.045166 0.045105 3.95109 0.045105 8.74669C0.045105 13.5423 3.89415 17.4482 8.66465 17.4482C13.4352 17.4482 17.2842 13.5423 17.2842 8.74669C17.2842 6.44234 16.3786 4.23023 14.7634 2.59758C13.1477 0.964561 10.9542 0.045166 8.66465 0.045166ZM2.0451 8.74669C2.0451 5.03543 5.01884 2.04517 8.66465 2.04517C10.4168 2.04517 12.0994 2.74859 13.3416 4.0042C14.5842 5.26018 15.2842 6.96591 15.2842 8.74669C15.2842 12.458 12.3105 15.4482 8.66465 15.4482C5.01884 15.4482 2.0451 12.458 2.0451 8.74669ZM17.0791 15.6767C16.6886 15.2862 16.0555 15.2862 15.6649 15.6767C15.2744 16.0672 15.2744 16.7004 15.6649 17.0909L18.2483 19.6743C18.6388 20.0648 19.272 20.0648 19.6625 19.6743C20.053 19.2838 20.053 18.6506 19.6625 18.2601L17.0791 15.6767Z"
                          fill="#B8B8B8"
                        />
                      </svg>
                    </div>,

                    searchKeyword ? (
                      <button
                        type="button"
                        className="text-sm uppercase font-bold text-main inline-block absolute bottom-[0.95rem] right-[1.125rem] "
                        onClick={() => setSearchKeyword('')}
                      >
                        Clear
                      </button>
                    ) : (
                      <small />
                    ),
                  ],
                }}
                placeholder="Search your tasks"
                hideBr
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearchKeyword(e.target.value);
                }}
              />
            </div>
          </nav>

          <div className="content">
            {tasks.length ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {tasks.map((task) => (
                  <Task key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="empty-state flex flex-col justify-center items-center mt-24">
                <div className="w-[247px] h-[241px] relative">
                  <Image src={illustrationEmpty} />
                </div>

                <h3 className="font-bold text-[24px] mt-10">
                  There are no tasks in this category.
                </h3>

                <div className="mt-10">
                  <Button
                    paddingClasses="px-8 py-6"
                    onClick={() => router.push(`/app/new-task`)}
                  >
                    Create New Task
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

TasksPage.layout = 'app';

export default TasksPage;
