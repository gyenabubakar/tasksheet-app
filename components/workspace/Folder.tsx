import React, { ComponentProps, useEffect, useState } from 'react';
import Image from 'next/image';
import { FolderType } from '~/assets/ts/types';
import iconFolder from '~/assets/icons/workspace/folder.svg';
import iconMoreOptions from '~/assets/icons/workspace/more-options.svg';
import hexToRGB from '~/assets/ts/hexToRGB';
import Link from 'next/link';
import ReactTooltip from 'react-tooltip';

interface FolderProps extends ComponentProps<'div'> {
  folder: FolderType;
  href: string;
}

const Folder: React.FC<FolderProps> = ({ className, href, folder }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { tasks, colour } = folder;
  const completedTasksPercent = (tasks.completed / tasks.total) * 100;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={href}>
      <a
        className={`folder-card bg-white shadow-lg shadow-faintmain p-5 rounded-small ${className}`}
      >
        <div className="head flex justify-between items-center">
          <div
            className="icon p-2.5 rounded-xl"
            style={{ backgroundColor: colour }}
          >
            <div className="icon-wrapper w-5 h-5 relative">
              <Image src={iconFolder} layout="fill" />
            </div>
          </div>

          <button>
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
