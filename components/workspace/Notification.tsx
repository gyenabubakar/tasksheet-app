import React from 'react';
import Image from 'next/image';
import moment from 'moment';
import { Notification } from '~/assets/firebase/firebaseTypes';
import { Timestamp } from 'firebase/firestore';

interface Props {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

const NotificationCard: React.FC<Props> = ({ notification, onClick }) => {
  const { payload, message, createdAt, readAt } = notification;

  const timeElapsed = moment((createdAt as Timestamp).toDate()).fromNow();

  return (
    <div
      className={`notification px-5 py-3 mb-3 rounded-small cursor-pointer flex ${
        !readAt ? 'bg-faintmain' : 'bg-white'
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="initiator-avatar mr-4">
        {payload.sender.avatar && (
          <div className="h-10 w-10 rounded-full overflow-hidden relative">
            <Image src={payload.sender.avatar} layout="fill" />
          </div>
        )}

        {!payload.sender.avatar && (
          <div className="h-10 w-10 rounded-full bg-main" />
        )}
      </div>

      <div className="notification-body grow flex flex-col">
        <p
          className={`text-base md:text-lg font-medium border-b pb-2 mb-1 w-full ${
            !readAt ? 'border-b-gray-300' : ''
          }`}
        >
          {message}
        </p>

        <div className="text-sm md:text-base text-gray-400 w-full">
          {timeElapsed}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
