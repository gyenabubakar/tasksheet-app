import React from 'react';
import type { AppProps } from 'next/app';

import '../styles/globals.css';
import { PageWithLayout } from '~/assets/ts/types';
import Head from 'next/head';
import useLayout from '~/hooks/useLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = useLayout((Component as PageWithLayout).layout);

  return (
    <>
      <Head>
        <title>TaskSheet</title>
        <link rel="icon" type="image/svg" href="/images/logo.svg" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
