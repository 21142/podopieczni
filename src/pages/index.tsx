import type { NextPage } from "next";
import PageLayout from "src/components/layouts/primary/PageLayout";
import Landing from "src/components/pages/landing/Landing";

const Home: NextPage = () => {
  return (
    <PageLayout>
      <Landing />
    </PageLayout>
  );
};

export default Home;
