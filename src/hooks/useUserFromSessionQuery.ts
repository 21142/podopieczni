import { api } from '~/lib/api';

export function useUserFromSessionQuery() {
  const user = api.auth.getUserFromSession.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount > 3 ? false : true;
    },
  });

  return user;
}

export default useUserFromSessionQuery;
