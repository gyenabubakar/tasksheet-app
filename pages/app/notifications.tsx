import Head from 'next/head';
import { PageWithLayout } from '~/assets/ts/types';

const NotificationsPage: PageWithLayout = () => {
  const message = 'Notifications';

  return (
    <>
      <Head>
        <title>Notifications | TaskSheet</title>
      </Head>

      <main>
        <h1>{message}</h1>
      </main>
    </>
  );
};

NotificationsPage.layout = 'app';

export default NotificationsPage;
