import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import 'react-datepicker/dist/react-datepicker.css';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import '~/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { PageWithLayout } from '~/assets/ts/types';
import useLayout from '~/hooks/useLayout';
import cookies from '~/assets/ts/cookies';
import LoadingOverlay from '~/components/misc/LoadingOverlay';
import UserContextProvider from '~/context/UserContextProvider';
import getFirebaseApp from '~/assets/firebase/getFirebaseApp';
import SplashScreen from '~/components/misc/SplashScreen';

interface WithUserCtxProps {
  user: User | null;
  PageComponent: PageWithLayout;
  pageProps: any;
  Layout: React.FC<{}>;
}

const WithUserContext: React.FC<WithUserCtxProps> = ({
  user,
  PageComponent,
  pageProps,
  Layout,
}) => {
  const commonChildren = (
    <Layout>
      <PageComponent {...pageProps} />
    </Layout>
  );

  if (PageComponent.layout === 'app') {
    if (user) {
      return (
        <UserContextProvider initialVue={user}>
          {commonChildren}
        </UserContextProvider>
      );
    }
    return <SplashScreen loadingText="TaskSheet" />;
  }

  return commonChildren;
};

function MyApp({ Component, pageProps }: AppProps) {
  const PageComponent = Component as PageWithLayout;
  const Layout = useLayout(PageComponent.layout);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        cookies.set('accessToken', (currentUser as any).accessToken);
      } else {
        cookies.remove('accessToken');
      }
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Head>
        <title>TaskSheet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" href="/images/logo.svg" />
        <link
          rel="stylesheet"
          type="text/css"
          href="/linearicons/css/linearicons.css"
        />
      </Head>

      <NextNProgress
        color="#5C68FF"
        startPosition={0.3}
        stopDelayMs={200}
        height={6}
        showOnShallow
      />

      <WithUserContext
        user={user}
        PageComponent={PageComponent}
        pageProps={pageProps}
        Layout={Layout}
      />

      <ToastContainer />
    </>
  );
}

export default MyApp;
