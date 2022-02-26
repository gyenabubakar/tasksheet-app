import useSWR from 'swr';
import { useRouter } from 'next/router';

import useUser from '~/hooks/useUser';
import { getFolder } from '~/assets/fetchers/folder';

const useFolder = () => {
  const router = useRouter();
  const { folderID } = router.query;

  const { user } = useUser();

  const { error, data: folder } = useSWR(
    'get-folder-details',
    getFolder(folderID as string, user.uid),
  );

  return { error, folder };
};

export default useFolder;
