import type { FC } from 'react';
import AccountSettingsForm from '~/components/form/AccountSettingsForm';
import PageLayout from '~/components/layouts/primary/PageLayout';
import { api } from '~/utils/api';

const settings: FC = ({}) => {
  const { data: me } = api.user.me.useQuery();

  return (
    <PageLayout>
      <AccountSettingsForm user={me} />
    </PageLayout>
  );
};

export default settings;
