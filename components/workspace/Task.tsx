import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import calculateTimeLeft from '~/assets/ts/calculateTimeLeft';
import hexToRGB from '~/assets/ts/hexToRGB';
import { TaskPriorityColour, TaskType } from '~/assets/ts/types';

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const [isMounted, setIsMounted] = useState(false);
  const {
    id,
    name,
    description,
    dueDate,
    members,
    priority,
    folder,
    createdBy,
  } = task;

  const timeLeft = calculateTimeLeft(moment(), dueDate);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={`/app/task/${id}`}>
      <a className="task-card bg-white shadow-lg shadow-faintmain px-0 py-5 rounded-small hover:shadow-2xl">
        <div className="heading px-5 text-sm flex items-center justify-between">
          <div className="priority flex items-center">
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0204 10.33L12.8004 9.11C12.5104 8.86 12.3404 8.49 12.3304 8.08C12.3104 7.63 12.4904 7.18 12.8204 6.85L14.0204 5.65C15.0604 4.61 15.4504 3.61 15.1204 2.82C14.8004 2.04 13.8104 1.61 12.3504 1.61H1.90039V0.75C1.90039 0.34 1.56039 0 1.15039 0C0.740391 0 0.400391 0.34 0.400391 0.75V19.25C0.400391 19.66 0.740391 20 1.15039 20C1.56039 20 1.90039 19.66 1.90039 19.25V14.37H12.3504C13.7904 14.37 14.7604 13.93 15.0904 13.14C15.4204 12.35 15.0404 11.36 14.0204 10.33Z"
                fill={TaskPriorityColour[priority]}
              />
            </svg>

            <span
              className="ml-2"
              style={{ color: TaskPriorityColour[priority] }}
            >
              {priority}
            </span>
          </div>

          <div
            className="due px-3 py-1 rounded-full"
            style={{
              backgroundColor: `rgba(${hexToRGB(folder.colour)!.rgb()}, 0.1)`,
              color: folder.colour,
            }}
          >
            {`${timeLeft}${timeLeft === 'Overdue' ? '' : ' left'} `}
          </div>
        </div>

        <div className="content px-5 mt-3">
          <p className="font-medium text-xl">{name}</p>
          <span className="text-base text-darkgray font-medium inline-block mt-3">
            {description.slice(0, 120)}
            {description.length > 120 && '...'}
          </span>

          <div className="progress mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400 text-base font-medium">
                Progress
              </span>
              <span className="text-base font-medium">80%</span>
            </div>

            <div className="progress-bar relative">
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
          </div>
        </div>

        <div className="footer flex justify-between border-t px-5 pt-3 mt-4">
          <div className="flex -space-x-2 overflow-hidden">
            {members.slice(0, 4).map((member, index) => (
              <div key={member.id} className="flex items-center">
                <div
                  data-tip
                  data-for={`assignee-${member.id}-${id}`}
                  className="h-8 w-8 rounded-full ring-2 ring-white inline-block overflow-hidden relative"
                >
                  <Image src={member.avatar} alt={member.name} layout="fill" />

                  {members.length > 4 && index === 3 && (
                    <div className="overlay absolute h-full w-full bg-black opacity-70 text-white text-sm font-medium flex items-center justify-center">
                      +{members.length - 3}
                    </div>
                  )}
                </div>

                {isMounted && (
                  <ReactTooltip
                    id={`assignee-${member.id}-${id}`}
                    place="top"
                    type="dark"
                    effect="solid"
                  >
                    {index === 3 ? `${members.length - 3} more` : member.name}
                  </ReactTooltip>
                )}
              </div>
            ))}
          </div>

          <div className="creator flex items-center">
            <span className="text-base font-medium text-darkgray mr-3">
              Creator:
            </span>

            <div
              data-tip
              data-for={`assigner-${id}`}
              className="h-8 w-8 rounded-full ring-2 ring-white inline-block overflow-hidden relative"
            >
              <Image
                src={createdBy.avatar}
                alt={createdBy.name}
                layout="fill"
              />
            </div>

            {isMounted && (
              <ReactTooltip
                id={`assigner-${id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                {createdBy.name}
              </ReactTooltip>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Task;
