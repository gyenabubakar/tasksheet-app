import React from 'react';
import Image from 'next/image';
import { FolderType } from '~/assets/ts/types';
import moment from 'moment';
import Link from 'next/link';

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  initiator: {
    avatar: string;
  };
  metadata: {
    folder: Pick<FolderType, 'id' | 'name'> | null;
    workspace: {
      id: string;
      name: string;
    };
  };
}

interface Props {
  notification: Notification;
}

const NotificationCard: React.FC<Props> = ({ notification }) => {
  const { initiator, message, createdAt } = notification;

  return (
    <Link href="/app/">
      <a className="notification px-5 py-3 mb-3 bg-white rounded-small flex">
        <div className="initiator-avatar mr-4">
          <div className="h-10 w-10 rounded-full overflow-hidden relative">
            <Image src={initiator.avatar} layout="fill" />
          </div>
        </div>

        <div className="notification-body grow flex flex-col">
          <p className="text-base md:text-lg font-medium border-b pb-2 mb-1 w-full">
            {message}
          </p>

          <div className="text-sm md:text-base text-gray-400 w-full">
            {moment(createdAt).fromNow()}
          </div>
        </div>
      </a>
    </Link>
  );
};

export default NotificationCard;
