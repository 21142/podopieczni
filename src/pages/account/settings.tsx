import { User } from '@prisma/client';
import type { FC } from 'react';
import ProfileForm from '~/components/form/ProfileForm';
import PageLayout from '~/components/layouts/primary/PageLayout';
import { api } from '~/utils/api';

interface settingsProps {
  id: string;
  user: User | null | undefined;
}

const settings: FC<settingsProps> = ({}) => {
  const { data: me } = api.user.me.useQuery();

  return (
    <PageLayout>
      <ProfileForm
        title="Your profile"
        user={me}
      />
    </PageLayout>
  );
};

export default settings;
