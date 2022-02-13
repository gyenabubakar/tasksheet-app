import React, { ComponentProps, FormEvent, useState } from 'react';
import Image from 'next/image';

import { MemberType } from '~/assets/ts/types';
import Options from '~/components/common/Options';
import iconBin from '~/assets/icons/workspace/bin.svg';
import iconBriefcase from '~/assets/icons/workspace/briefcase.svg';
import iconMoreOptions from '~/assets/icons/workspace/more-options.svg';
import iconUserAdd from '~/assets/icons/workspace/gray-user-add.svg';
import hexToRGB from '~/assets/ts/hexToRGB';

interface MemberProps extends ComponentProps<'div'> {
  member: MemberType;
  onAssignTask: (m: MemberType) => void;
  onMakeAdmin: (m: MemberType) => void;
  onDelete: (m: MemberType) => void;
}

const Member: React.FC<MemberProps> = ({
  className = '',
  member,
  onAssignTask,
  onDelete,
  onMakeAdmin,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const { tasks, avatar, name, role } = member;

  const colour = '#5C68FF';

  const completedTasksPercent = (tasks.completed / tasks.total) * 100;

  function onShowOptions(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  }

  return (
    <div className={`member-card card ${className}`}>
      <div className="head flex justify-end items-center relative">
        <button
          id={`btn-${member.id}-options`}
          className="relative"
          onClick={onShowOptions}
        >
          <Image src={iconMoreOptions} width="24px" height="24px" />

          {showOptions && (
            <Options
              className="absolute right-0"
              show={showOptions}
              setShow={setShowOptions}
              originID={`btn-${member.id}-options`}
              optionObject={member}
              options={[
                {
                  element: (
                    <>
                      <Image src={iconBriefcase} width="20px" height="20px" />
                      <span className="">Assign task</span>
                    </>
                  ),
                  onClick(m: MemberType) {
                    onAssignTask(m);
                  },
                },
                {
                  element: (
                    <>
                      <Image src={iconUserAdd} width="20px" height="20px" />
                      <span className="">Make admin</span>
                    </>
                  ),
                  onClick(m: MemberType) {
                    onMakeAdmin(m);
                  },
                },
                {
                  element: (
                    <>
                      <Image src={iconBin} width="20px" height="20px" />
                      <span className="text-red-500">Remove</span>
                    </>
                  ),
                  onClick(m: MemberType) {
                    onDelete(m);
                  },
                },
              ]}
            />
          )}
        </button>
      </div>

      <div className="details">
        <div className="avatar relative w-[117px] h-[117px] bg-gray-300 rounded-full overflow-hidden mx-auto">
          <Image src={avatar} layout="fill" />
        </div>

        <div className="text-center mt-6">
          <p className="font-medium">{name}</p>
          <span className="text-base text-darkgray">{role}</span>
        </div>

        <div className="progress mt-5">
          <div className="text-right mb-3">
            <div className="stat font-medium text-base">
              <span>{tasks.completed}</span>/
              <span className="text-darkgray">{tasks.total}</span>
            </div>
          </div>

          <div className="progress-bar relative">
            <div
              className="point absolute w-4 h-4 rounded-full -top-1"
              style={{
                backgroundColor: colour,
                left: `${completedTasksPercent}%`,
              }}
            />

            <div
              className="bar-inner absolute h-full rounded-l-full"
              style={{
                width: `${completedTasksPercent + 0.5}%`,
                backgroundColor: colour,
              }}
            />

            <div
              className="bar w-full h-2 rounded-full overflow-hidden relative opacity-25"
              style={{
                backgroundColor: `rgba(${hexToRGB(colour)!.rgb()}, 0.8)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Member;
