import type { FC } from 'react';
import AccountSettingsForm from '~/components/form/AccountSettingsForm';
import PageLayout from '~/components/layouts/primary/PageLayout';
import Spinner from '~/components/spinner/Spinner';
import LoginToAccessPage from '~/components/utils/login-or-landing/LoginToAccessPage';
import { api } from '~/utils/api';

const settings: FC = ({}) => {
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

  if (isLoading)
    return (
      <PageLayout>
        <div className="grid h-[50vh] content-center">
          <Spinner />
        </div>
      </PageLayout>
    );

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

export default settings;
