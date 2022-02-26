import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { PageWithLayout } from '~/assets/ts/types';
import Options from '~/components/common/Options';

import NotificationCard, {
  Notification,
} from '~/components/workspace/Notification';
import iconBin from '~/assets/icons/workspace/bin.svg';
import { NotificationType } from '~/assets/firebase/firebaseTypes';
import swal from '~/assets/ts/sweetalert';
import {
  doc,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import useUser from '~/hooks/useUser';

interface PageProps {
  notifications: Notification[];
}

const NotificationsPage: PageWithLayout<PageProps> = ({ notifications }) => {
  const router = useRouter();
  const { user } = useUser();

  const [showOptions, setShowOptions] = useState(false);

  function onNotificationClick(notification: Notification) {
    const notifRef = doc(
      getFirestore(),
      `users/${user.uid}`,
      `notifications/${notification.id}`,
    );
    updateDoc(notifRef, {
      readAt: serverTimestamp(),
    });

    switch (notification.type) {
      case NotificationType.WorkspaceInviteCreated:
        router.push(`/app/invitation/${notification.payload.id}`);
        break;
    }
  }

  function onMarkAllAsRead() {
    // eslint-disable-next-line no-console
    console.log('onMarkAllAsRead');
  }

  function onRemoveAll() {
    // eslint-disable-next-line no-console
    console.log('onRemoveAll');
  }

  return (
    <>
      <Head>
        <title>Notifications | TaskSheet</title>
      </Head>

      <main className="w-full md:w-9/12 lg:w-7/12 mx-auto">
        <div className="heading mb-5 flex justify-between items-center">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
            Notifications&nbsp;
            {notifications.length && (
              <span className="text-main">({notifications.length})</span>
            )}
          </h1>

          <button
            className="show-notifications-options relative px-3 py-5 rounded-full hover:bg-faintmain"
            onClick={() => setShowOptions((prevState) => !prevState)}
          >
            <svg
              width="20"
              height="6"
              viewBox="0 0 20 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.20002 3.0001C5.20002 3.63662 4.94717 4.24707 4.49708 4.69715C4.04699 5.14724 3.43654 5.4001 2.80002 5.4001C2.1635 5.4001 1.55306 5.14724 1.10297 4.69715C0.652881 4.24707 0.400024 3.63662 0.400024 3.0001C0.400024 2.36358 0.652881 1.75313 1.10297 1.30304C1.55306 0.852955 2.1635 0.600098 2.80002 0.600098C3.43654 0.600098 4.04699 0.852955 4.49708 1.30304C4.94717 1.75313 5.20002 2.36358 5.20002 3.0001ZM12.4 3.0001C12.4 3.63662 12.1472 4.24707 11.6971 4.69715C11.247 5.14724 10.6365 5.4001 10 5.4001C9.3635 5.4001 8.75306 5.14724 8.30297 4.69715C7.85288 4.24707 7.60002 3.63662 7.60002 3.0001C7.60002 2.36358 7.85288 1.75313 8.30297 1.30304C8.75306 0.852955 9.3635 0.600098 10 0.600098C10.6365 0.600098 11.247 0.852955 11.6971 1.30304C12.1472 1.75313 12.4 2.36358 12.4 3.0001ZM17.2 5.4001C17.8365 5.4001 18.447 5.14724 18.8971 4.69715C19.3472 4.24707 19.6 3.63662 19.6 3.0001C19.6 2.36358 19.3472 1.75313 18.8971 1.30304C18.447 0.852955 17.8365 0.600098 17.2 0.600098C16.5635 0.600098 15.9531 0.852955 15.503 1.30304C15.0529 1.75313 14.8 2.36358 14.8 3.0001C14.8 3.63662 15.0529 4.24707 15.503 4.69715C15.9531 5.14724 16.5635 5.4001 17.2 5.4001Z"
                fill="#121212"
              />
            </svg>

            {showOptions && (
              <Options
                className="absolute top-10 right-0"
                show={showOptions}
                setShow={setShowOptions}
                originID="show-notifications-options"
                options={[
                  {
                    element: (
                      <>
                        <svg
                          width="15"
                          height="12"
                          viewBox="0 0 15 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.16663 5.99992L5.33329 10.1666L13.6666 1.83325"
                            stroke="#A6A6A6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        <span className="text-gray-600">Mark all as read</span>
                      </>
                    ),
                    onClick() {
                      setShowOptions(false);
                      onMarkAllAsRead();
                    },
                  },
                  {
                    element: (
                      <>
                        <Image src={iconBin} width="20px" height="20px" />
                        <span className="text-red-500">Remove all</span>
                      </>
                    ),
                    onClick() {
                      setShowOptions(false);
                      onRemoveAll();
                    },
                  },
                ]}
              />
            )}
          </button>
        </div>

        {notifications.length && (
          <div className="notifications">
            {notifications.map((notification) => {
              return (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={(n) => onNotificationClick(n)}
                />
              );
            })}
          </div>
        )}
      </main>
    </>
  );
};

NotificationsPage.layout = 'app';

export default NotificationsPage;
