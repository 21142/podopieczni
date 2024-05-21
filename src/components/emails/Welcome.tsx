import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { env } from '~/env.mjs';

interface WelcomeEmailProps {
  name: string | null | undefined;
  href: string | null | undefined;
}

const WelcomeEmail = ({ name, href }: WelcomeEmailProps) => {
  const previewText = `Welcome to podopieczni.pl ${name}!`;
  const fallbackUrl = `${env.NEXT_PUBLIC_BASE_URL}/welcome`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Text className="mx-0 my-8 p-0 text-center text-2xl font-bold">
              Witamy w{' '}
              <span className="font-extrabold text-fuchsia-600">
                podopieczni
              </span>
              !
            </Text>
            <Text className="text-sm">Cześć {name},</Text>
            <Text className="text-sm">
              Jesteśmy bardzo podekscytowani, że tu jesteś. Mamy nadzieję, że
              będziesz czerpać radość podczas korzystania z naszej platformy.
            </Text>
            <Text className="text-sm">
              Jeśli masz jakiekolwiek pytania lub potrzebujesz pomocy, nie wahaj
              się z nami skontaktować. Jesteśmy po to, aby Ci pomóc!
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded-md bg-[#A704B5] p-3 text-center text-xs font-semibold text-white no-underline"
                href={href ?? fallbackUrl}
              >
                Zaloguj się i zaczynajmy!
              </Button>
            </Section>
            <Text className="text-sm">
              Pozdrawiamy,
              <br />
              Zespół podopieczni
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
