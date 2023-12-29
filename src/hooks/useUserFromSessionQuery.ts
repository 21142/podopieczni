import { api } from '~/lib/api';

export function useUserFromSessionQuery() {
  const user = api.auth.getUserFromSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  return user;
}

export default useUserFromSessionQuery;
