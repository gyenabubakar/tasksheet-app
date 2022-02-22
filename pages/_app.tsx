import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import 'react-datepicker/dist/react-datepicker.css';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import '~/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { PageWithLayout } from '~/assets/ts/types';
import Head from 'next/head';
import useLayout from '~/hooks/useLayout';
import { ToastContainer } from 'react-toastify';
import firebaseConfig from '~/assets/ts/firebaseConfig';
import cookies from '~/assets/ts/cookies';

function MyApp({ Component, pageProps }: AppProps) {
  const PageComponent = Component as PageWithLayout;
  const Layout = useLayout(PageComponent.layout);

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig);

    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        cookies.set('accessToken', (user as any).accessToken);
      } else {
        cookies.remove('accessToken');
      }
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

      <Layout>
        {PageComponent.SecondaryLayout ? (
          <PageComponent.SecondaryLayout>
            <PageComponent {...pageProps} />
          </PageComponent.SecondaryLayout>
        ) : (
          <PageComponent {...pageProps} />
        )}
      </Layout>

      <ToastContainer />
    </>
  );
}

export default MyApp;
