import AccountSettingsForm from '~/components/forms/AccountSettingsForm';
import PageLayout from '~/components/layouts/PageLayout';
import LoginToAccessPage from '~/components/pages/LoginToAccessPage';
import Spinner from '~/components/spinners/Spinner';
import { api } from '~/lib/api';

const UserSettings = () => {
  const {
    data: me,
    isLoading,
    error,
  } = api.user.me.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (error?.message === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (isLoading) {
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (error)
    return (
      <PageLayout>
        <LoginToAccessPage />
      </PageLayout>
    );

  return (
    <PageLayout>
      <AccountSettingsForm user={me} />
    </PageLayout>
  );
};

export default UserSettings;
