import { type Session } from 'next-auth';
import { api } from '~/lib/api';

export function useUserFromSessionQuery(session?: Session | null) {
  const user = api.auth.getUserFromSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount > 3 ? false : true;
    },
    enabled: session?.user !== undefined,
  });

  return user;
}

export default useUserFromSessionQuery;
