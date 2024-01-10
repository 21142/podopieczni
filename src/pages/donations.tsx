import type { GetServerSideProps, NextPage } from 'next';
import PageLayout from '~/components/layouts/PageLayout';

const Donations: NextPage = () => {
  return (
    <PageLayout>
      <p>testingdev</p>
    </PageLayout>
  );
};

export default Donations;

export const getServerSideProps: GetServerSideProps = () => {
  throw new Error('Internal server error - Something went wrong!');
};
