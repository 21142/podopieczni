import { api } from '~/lib/api';

// TODO: Conside renaming other hooks to PascalCase
export function useMeQuery() {
  const me = api.user.me.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.data?.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount > 3 ? false : true;
    },
  });

  return me;
}

export default useMeQuery;
