import React from 'react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg" href="/images/logo.svg" />
      </Head>

      <NextNProgress
        color="#5C68FF"
        startPosition={0.3}
        stopDelayMs={200}
        height={6}
        showOnShallow
      />

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
