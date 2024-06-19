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

interface WelcomeToOrganizationEmailProps {
  username?: string;
  userImage?: string;
  teamName?: string;
  teamImage?: string;
  goToDashboardLink?: string;
}

const baseUrl = env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

const WelcomeToOrganizationEmail = ({
  username,
  userImage = `${baseUrl}/images/no-profile-picture.svg`,
  teamName = 'Podopieczni',
  teamImage = `${baseUrl}/images/no-profile-picture.svg`,
  goToDashboardLink = `${baseUrl}/dashboard`,
}: WelcomeToOrganizationEmailProps) => {
  const previewText = `Witaj w ${teamName} na podopieczni`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-neutral-100 p-[20px]">
            <Text className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Witaj w {teamName} na{' '}
              <span className="font-extrabold text-fuchsia-600">
                podopieczni
              </span>
              !
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Cześć {username},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Twoje konto na{' '}
              <span className="font-extrabold text-fuchsia-600">
                podopieczni
              </span>{' '}
              zostało powiązane z organizacją <strong>{teamName}</strong>. W
              osobnym mailu od podopieczni otrzymasz link do zalogowania się na
              swoje konto. <strong>Najpierw zaloguj się na swoje konto</strong>.
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
                    alt="accepted you to"
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
            <Text className="text-[14px] leading-[24px] text-black">
              Jeśli zalogowałeś się już na swoje konto kliknij w poniższy
              przycisk, aby przejść do panelu organizacji{' '}
              <strong>{teamName}</strong> na <strong>podopieczni</strong>.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-black p-4 text-center text-[12px] font-semibold text-white no-underline"
                href={goToDashboardLink}
              >
                Przejdź do panelu organizacji
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              Jeśli przycisk nie działa, kliknij poniższy link lub skopiuj go:{' '}
              <Link
                href={goToDashboardLink}
                className="text-primary-400 no-underline"
              >
                {goToDashboardLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeToOrganizationEmail;
