import React, { ComponentProps, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { FolderType } from '~/assets/ts/types';
import iconFolder from '~/assets/icons/workspace/folder.svg';
import iconMoreOptions from '~/assets/icons/workspace/more-options.svg';
import iconPencil from '~/assets/icons/workspace/pencil-gray.svg';
import iconBin from '~/assets/icons/workspace/bin.svg';
import hexToRGB from '~/assets/ts/hexToRGB';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';

interface FolderProps extends ComponentProps<'div'> {
  folder: FolderType;
  href: string;
  onDelete: (f: FolderType) => void;
  onEdit: (f: FolderType) => void;
}

const Folder: React.FC<FolderProps> = ({
  className,
  href,
  folder,
  onDelete,
  onEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const { tasks, colour } = folder;
  const completedTasksPercent = (tasks.completed / tasks.total) * 100;

  function onShowOptions(e: FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions((prevState) => !prevState);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = document.querySelector(`#btn-${folder.id}-options`);
      if (target.id !== `btn-${folder.id}-options` && !btn?.contains(target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <Link href={href}>
      <a
        className={`folder-card bg-white shadow-lg shadow-faintmain p-5 rounded-small ${className}`}
      >
        <div className="head flex justify-between items-center relative">
          <div
            className="icon p-2.5 rounded-xl"
            style={{ backgroundColor: colour }}
          >
            <div className="icon-wrapper w-5 h-5 relative">
              <Image src={iconFolder} layout="fill" />
            </div>
          </div>

          <button
            id={`btn-${folder.id}-options`}
            className="relative"
            onClick={onShowOptions}
          >
            <Image
              src={iconMoreOptions}
              width="24px"
              height="24px"
              data-tip
              data-for={`folder-${folder.id}-options`}
            />

            {isMounted && (
              <ReactTooltip
                id={`folder-${folder.id}-options`}
                place="left"
                type="dark"
                effect="solid"
              >
                More options
              </ReactTooltip>
            )}

            {showOptions && (
              <div className="options absolute">
                <ul>
                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(folder);
                    }}
                  >
                    <Image src={iconPencil} width="17px" height="16px" />
                    <span>Edit</span>
                  </li>

                  <li
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(folder);
                    }}
                  >
                    <Image src={iconBin} width="20px" height="20px" />
                    <span className="text-red-500">Remove</span>
                  </li>
                </ul>
              </div>
            )}
          </button>
        </div>

        <div className="details mt-5">
          <p className="font-medium">{folder.name}</p>
          <span className="text-darkgray text-base">
            {folder.category.name}
          </span>

          <div className="progress mt-5">
            <div className="text-right mb-3">
              <div className="stat font-medium text-base">
                <span>{tasks.completed}</span>/
                <span className="text-darkgray">{tasks.total}</span>
              </div>
            </div>

            <div className="progress-bar relative">
              <div
                className="point absolute w-6 h-6 rounded-full -top-1.5"
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
                  backgroundColor: `rgba(${hexToRGB(colour)!.rgba()}, 0.8)`,
                }}
              />
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Folder;
