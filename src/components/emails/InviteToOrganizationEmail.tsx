import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { env } from '~/env.mjs';

interface InviteToOrganizationEmailProps {
  username?: string;
  userImage?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

const InviteToOrganizationEmail = ({
  username,
  userImage = `${baseUrl}/images/no-profile-picture.svg`,
  teamName = 'Podopieczni',
  teamImage = `${baseUrl}/images/no-profile-picture.svg`,
  inviteLink = `${baseUrl}/dashboard`,
}: InviteToOrganizationEmailProps) => {
  const previewText = `Dołącz do ${teamName} na podopieczni`;

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
              Dołącz do {teamName} na{' '}
              <span className="font-extrabold text-fuchsia-600">
                podopieczni
              </span>
              !
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Cześć {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Twója prośba o dołączenie do {teamName} została{' '}
              <strong>zaakceptowana</strong>. Kliknij poniższy przycisk, aby
              dołączyć do zespołu <strong>{teamName}</strong> na{' '}
              <strong>podopieczni</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={userImage}
                    width="64"
                    height="64"
                    alt={username}
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`${baseUrl}/images/arrow.png`}
                    width="12"
                    height="9"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full"
                    src={teamImage}
                    width="64"
                    height="64"
                    alt={teamName}
                  />
                </Column>
              </Row>
            </Section>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-black p-4 text-center text-[12px] font-semibold text-white no-underline"
                href={inviteLink}
              >
                Dołacz do {teamName}
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Jeśli przycisk nie działa, kliknij poniższy link lub skopiuj go:{' '}
              <Link
                href={inviteLink}
                className="text-primary-400 no-underline"
              >
                {inviteLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InviteToOrganizationEmail;
