import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { LinkButton } from 'src/components/buttons/link/LinkButton';
import PageLayout from 'src/components/layouts/primary/PageLayout';
import { trpc } from 'src/utils/trpc';

const Welcome: NextPage = () => {
  const router = useRouter();
  const { mutateAsync: setRoleAsAdopter } =
    trpc.auth.setAdoptingRole.useMutation();
  const { mutateAsync: setRoleAsShelter } =
    trpc.auth.setShelterWorkerRole.useMutation();

  const setAdopterRole = async () => {
    await setRoleAsAdopter();
    console.log('HERE? ADOPTER SET');
    router.push('/register');
  };

  const setShelterRole = async () => {
    await setRoleAsShelter();
    console.log('HERE? SHELTER SET');
    router.push('/dashboard');
  };
  return (
    <>
      <PageLayout>
        <div className="grid h-144 place-items-center content-center">
          <p className="text-lg">Please, tell us what are you here for</p>
          <div className="flex gap-5 p-5">
            <LinkButton
              value="I want to adopt a pet"
              onClick={setAdopterRole}
            />
            <LinkButton
              value="I work in a shelter"
              onClick={setShelterRole}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Welcome;
