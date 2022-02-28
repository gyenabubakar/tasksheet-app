import { useRouter } from 'next/router';
import useSWR from 'swr';

import useUser from '~/hooks/useUser';
import { getWorkspace } from '~/assets/fetchers/workspace';

function useWorkspace() {
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
    },
  );

  return { error, workspace };
}

export default useWorkspace;
