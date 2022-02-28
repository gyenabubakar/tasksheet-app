import React, { ComponentProps, FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FolderType } from '~/assets/ts/types';
import iconFolder from '~/assets/icons/workspace/folder.svg';
import iconMoreOptions from '~/assets/icons/workspace/more-options.svg';
import iconPencil from '~/assets/icons/workspace/pencil-gray.svg';
import iconBin from '~/assets/icons/workspace/bin.svg';
import hexToRGB from '~/assets/ts/hexToRGB';
import Options from '~/components/common/Options';

type FolderProps = ComponentProps<'div'> & {
  folder: FolderType;
  href: string;
  canModify: boolean;
  onDelete: (f: FolderType) => void;
  onEdit: (f: FolderType) => void;
};

const Folder: React.FC<FolderProps> = ({
  className,
  href,
  folder,
  canModify,
  onDelete,
  onEdit,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const { tasks, colour } = folder;
  const completedTasksPercent =
    ((tasks?.completed || 0) / (tasks?.total || 0)) * 100;

  function onShowOptions(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (canModify) setShowOptions((prevState) => !prevState);
  }

  return (
    <Link href={href}>
      <a className={`folder-card card ${className}`}>
        <div className="head flex justify-between items-center relative">
          <div
            className="icon p-2.5 rounded-xl"
            style={{ backgroundColor: colour }}
          >
            <div className="icon-wrapper w-5 h-5 relative">
              <Image src={iconFolder} layout="fill" />
            </div>
          </div>

          {canModify && (
            <button
              id={`btn-${folder.id}-options`}
              className="relative"
              onClick={onShowOptions}
            >
              <Image src={iconMoreOptions} width="24px" height="24px" />

              {showOptions && (
                <Options
                  className="absolute right-0"
                  show={showOptions}
                  setShow={setShowOptions}
                  originID={`btn-${folder.id}-options`}
                  optionObject={folder}
                  options={[
                    {
                      element: (
                        <>
                          <Image src={iconPencil} width="17px" height="16px" />
                          <span>Edit</span>
                        </>
                      ),
                      onClick(f: FolderType) {
                        if (canModify) onEdit(f);
                      },
                    },
                    {
                      element: (
                        <>
                          <Image src={iconBin} width="20px" height="20px" />
                          <span className="text-red-500">Remove</span>
                        </>
                      ),
                      onClick(f: FolderType) {
                        if (canModify) onDelete(f);
                      },
                    },
                  ]}
                />
              )}
            </button>
          )}
        </div>

        <div className="details mt-5">
          <p className="font-medium">{folder.name}</p>
          <span className="text-darkgray text-base">{folder.category}</span>

          {folder.tasks && (
            <div className="progress mt-5">
              <div className="text-right mb-3">
                <div className="stat font-medium text-base">
                  <span>{tasks?.completed || '0'}</span>/
                  <span className="text-darkgray">{tasks?.total || '0'}</span>
                </div>
              </div>

              <div className="progress-bar relative">
                <div
                  className="point absolute w-6 h-6 rounded-full -top-1.5 -left-1"
                  style={{
                    backgroundColor: colour,
                    left: `${completedTasksPercent}%`,
                  }}
                />

                <div
                  className="bar-inner absolute h-full rounded-l-full"
                  style={{
                    width: `${completedTasksPercent + 0.3}%`,
                    backgroundColor: colour,
                  }}
                />

                <div
                  className="bar w-full h-3 rounded-full overflow-hidden relative opacity-25"
                  style={{
                    backgroundColor: `rgba(${hexToRGB(colour)!.rgb()}, 0.8)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </a>
    </Link>
  );
};

export default Folder;
