import Head from 'next/head';
import React from 'react';
import { PageWithLayout } from '~/assets/ts/types';

const WorkspacesHomePage: PageWithLayout = () => {
  const message = 'All Workspaces';

  return (
    <>
      <Head>
        <title>Your Workspaces · TaskSheet</title>
      </Head>

      <main>
        <h1>{message}</h1>
      </main>
    </>
  );
};

WorkspacesHomePage.layout = 'app';

export default WorkspacesHomePage;
