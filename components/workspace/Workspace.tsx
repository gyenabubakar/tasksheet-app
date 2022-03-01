import Link from 'next/link';
import React from 'react';
import { WorkspaceCardInfo } from '~/assets/ts/types';

interface WorkspaceProps {
  workspace: WorkspaceCardInfo;
}

const Workspace: React.FC<WorkspaceProps> = ({ workspace }) => {
  const { id, name, description, foldersCount, membersCount, tasksCount } =
    workspace;

  return (
    <Link href={`/app/workspaces/${id}`}>
      <a className="block workspace-card card w-full hover:shadow-2xl">
        <p className="text-2xl font-bold mb-5 text-main">{name}</p>

        <span className="text-base text-darkgray">
          {description.slice(0, 140)}
          {description.length > 140 && '...'}
        </span>

        {foldersCount && membersCount && tasksCount && (
          <div className="flex items-center justify-between mt-10">
            <div className="folder-count flex items-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.0169 5.99175C19.4148 6.55833 18.9405 7.25 18.2482 7.25H1C0.447716 7.25 0 6.80228 0 6.25V4.42C0 1.98 1.98 0 4.42 0H6.74C8.37 0 8.88 0.53 9.53 1.4L10.93 3.26C11.24 3.67 11.28 3.72 11.86 3.72H14.65C16.4546 3.72 18.0516 4.61709 19.0169 5.99175Z"
                  fill="#5C68FF"
                />
                <path
                  d="M18.9834 8.75001C19.5343 8.75001 19.9815 9.19566 19.9834 9.74662L20 14.6503C20 17.6003 17.6 20.0003 14.65 20.0003H5.35C2.4 20.0003 0 17.6003 0 14.6503V9.75026C0 9.19798 0.447707 8.75026 0.999987 8.75026L18.9834 8.75001Z"
                  fill="#5C68FF"
                />
              </svg>

              <span className="ml-3">{foldersCount}</span>
            </div>

            <div className="members-count flex items-center">
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.533 5.77C16.463 5.76 16.393 5.76 16.323 5.77C14.773 5.72 13.543 4.45 13.543 2.89C13.543 1.3 14.833 0 16.433 0C18.023 0 19.323 1.29 19.323 2.89C19.313 4.45 18.083 5.72 16.533 5.77Z"
                  fill="#5C68FF"
                />
                <path
                  d="M19.7916 12.7004C18.6716 13.4504 17.1016 13.7304 15.6516 13.5404C16.0316 12.7204 16.2316 11.8104 16.2416 10.8504C16.2416 9.8504 16.0216 8.9004 15.6016 8.0704C17.0816 7.8704 18.6516 8.1504 19.7816 8.9004C21.3616 9.9404 21.3616 11.6504 19.7916 12.7004Z"
                  fill="#5C68FF"
                />
                <path
                  d="M5.44016 5.77C5.51016 5.76 5.58016 5.76 5.65016 5.77C7.20016 5.72 8.43016 4.45 8.43016 2.89C8.43016 1.29 7.14016 0 5.54016 0C3.95016 0 2.66016 1.29 2.66016 2.89C2.66016 4.45 3.89016 5.72 5.44016 5.77Z"
                  fill="#5C68FF"
                />
                <path
                  d="M5.55109 10.8506C5.55109 11.8206 5.76109 12.7406 6.14109 13.5706C4.73109 13.7206 3.26109 13.4206 2.18109 12.7106C0.601094 11.6606 0.601094 9.95059 2.18109 8.90059C3.25109 8.18059 4.76109 7.89059 6.18109 8.05059C5.77109 8.89059 5.55109 9.84059 5.55109 10.8506Z"
                  fill="#5C68FF"
                />
                <path
                  d="M11.1208 13.87C11.0408 13.86 10.9508 13.86 10.8608 13.87C9.02078 13.81 7.55078 12.3 7.55078 10.44C7.56078 8.54 9.09078 7 11.0008 7C12.9008 7 14.4408 8.54 14.4408 10.44C14.4308 12.3 12.9708 13.81 11.1208 13.87Z"
                  fill="#5C68FF"
                />
                <path
                  d="M7.87078 15.9406C6.36078 16.9506 6.36078 18.6106 7.87078 19.6106C9.59078 20.7606 12.4108 20.7606 14.1308 19.6106C15.6408 18.6006 15.6408 16.9406 14.1308 15.9406C12.4208 14.7906 9.60078 14.7906 7.87078 15.9406Z"
                  fill="#5C68FF"
                />
              </svg>

              <span className="ml-3">{membersCount}</span>
            </div>

            <div className="tasks-count flex items-center">
              <svg
                width="24"
                height="14"
                viewBox="0 0 24 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.1797 0.25C15.4697 0.25 13.4297 0.9 13.4297 4V10C13.4297 13.1 15.4697 13.75 17.1797 13.75C18.8897 13.75 20.9297 13.1 20.9297 10V4C20.9297 0.9 18.8897 0.25 17.1797 0.25Z"
                  fill="#5C68FF"
                />
                <path
                  d="M6.82031 0.25C5.11031 0.25 3.07031 0.9 3.07031 4V10C3.07031 13.1 5.11031 13.75 6.82031 13.75C8.53031 13.75 10.5703 13.1 10.5703 10V4C10.5703 0.9 8.53031 0.25 6.82031 0.25Z"
                  fill="#5C68FF"
                />
                <path
                  d="M13.4303 6.25H10.5703V7.75H13.4303V6.25Z"
                  fill="#292D32"
                />
                <path
                  d="M22.5 10.25C22.09 10.25 21.75 9.91 21.75 9.5V4.5C21.75 4.09 22.09 3.75 22.5 3.75C22.91 3.75 23.25 4.09 23.25 4.5V9.5C23.25 9.91 22.91 10.25 22.5 10.25Z"
                  fill="#5C68FF"
                />
                <path
                  d="M1.5 10.25C1.09 10.25 0.75 9.91 0.75 9.5V4.5C0.75 4.09 1.09 3.75 1.5 3.75C1.91 3.75 2.25 4.09 2.25 4.5V9.5C2.25 9.91 1.91 10.25 1.5 10.25Z"
                  fill="#5C68FF"
                />
              </svg>

              <span className="ml-3">{tasksCount}</span>
            </div>
          </div>
        )}
      </a>
    </Link>
  );
};

export default Workspace;
