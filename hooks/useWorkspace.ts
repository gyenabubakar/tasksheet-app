import { useRouter } from 'next/router';
import useSWR from 'swr';

import useUser from '~/hooks/useUser';
import { getWorkspace } from '~/assets/fetchers/workspace';
import { PublicConfiguration } from 'swr/dist/types';
import { Workspace } from '~/assets/firebase/firebaseTypes';

function useWorkspace(
  config: Partial<PublicConfiguration<Workspace, any, any>> = {},
) {
  const { user } = useUser();
  const router = useRouter();
  const { workspaceID } = router.query;

  const { error, data: workspace } = useSWR(
    'get-workspace-details',
    getWorkspace(workspaceID as string, user.uid),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      ...config,
    },
  );

  return { error, workspace };
}

export default useWorkspace;
