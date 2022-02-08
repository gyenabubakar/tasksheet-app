import { PageWithLayout } from '~/assets/ts/types';
import { useRouter } from 'next/router';

const FolderDetailsPage: PageWithLayout = () => {
  const router = useRouter();

  return (
    <main>
      <h1>Folder - {router.query.folderID}</h1>
    </main>
  );
};

FolderDetailsPage.layout = 'app';

export default FolderDetailsPage;
