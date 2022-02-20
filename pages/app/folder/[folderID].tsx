import { useRouter } from 'next/router';
import Head from 'next/head';
import { PageWithLayout } from '~/assets/ts/types';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import Navigation from '~/components/common/Navigation';

const FolderDetailsPage: PageWithLayout = () => {
  const router = useRouter();
  const { folderID } = router.query;

  return (
    <>
      <Head>
        <title>
          {folderID} | Workspace Name{pageTitleSuffix}
        </title>
      </Head>

      <Navigation />

      <main>
        <h1 className="text-4xl font-bold">React Projects</h1>
      </main>
    </>
  );
};

FolderDetailsPage.layout = 'app';

export default FolderDetailsPage;
