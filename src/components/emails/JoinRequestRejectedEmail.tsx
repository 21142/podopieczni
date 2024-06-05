import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { env } from '~/env.mjs';

interface JoinRequestRejectedEmailProps {
  username?: string;
  teamName?: string;
  shelterAssociateLink?: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

const JoinRequestRejectedEmail = ({
  username,
  teamName = 'Podopieczni',
  shelterAssociateLink = `${baseUrl}/dashboard`,
}: JoinRequestRejectedEmailProps) => {
  const previewText = `Prośba o dołączenie do ${teamName} odrzucone`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-neutral-100 p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/images/no-profile-picture.svg`}
                width="40"
                height="37"
                alt="Podopieczni logo"
                className="mx-auto my-0"
              />
            </Section>
            <Text className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Twoja prośba o dołączenie do {teamName} została odrzucona!
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Cześć {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Twója prośba o dołączenie do {teamName} została{' '}
              <strong>odrzucona</strong>. Kliknij poniższy przycisk, aby wysłać
              prośbę o dołączenie do innego schroniska na{' '}
              <strong>podopieczni</strong>.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-black p-4 text-center text-[12px] font-semibold text-white no-underline"
                href={shelterAssociateLink}
              >
                Spróbuj dołączyć do innego schroniska
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Jeśli przycisk nie działa, kliknij poniższy link lub skopiuj go:{' '}
              <Link
                href={shelterAssociateLink}
                className="text-primary-400 no-underline"
              >
                {shelterAssociateLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default JoinRequestRejectedEmail;
