import { useRouter } from 'next/router';
import Head from 'next/head';

import { PageWithLayout } from '~/assets/ts/types';
import pageTitleSuffix from '~/assets/pageTitleSuffix';
import Navigation from '~/components/common/Navigation';

const EditFolderPage: PageWithLayout = () => {
  const router = useRouter();
  const { folderID } = router.query;

  return (
    <>
      <Head>
        <title>Edit Folder Info{pageTitleSuffix}</title>
      </Head>

      <Navigation backUrl={`/app/folder/${folderID}`} />

      <main>
        <h1>Edit folder info</h1>
      </main>
    </>
  );
};

EditFolderPage.layout = 'app';

export default EditFolderPage;
