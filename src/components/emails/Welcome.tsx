import {
  Body,
  Button,
  Container,
  Head,
  Heading,
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
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Welcome to podopieczni!
            </Heading>
            <Text className="text-sm">Hello {name},</Text>
            <Text className="text-sm">
              We&apos;re excited to have you onboard at <span>podopieczni</span>
              . We hope you will enjoy your journey with us. If you have any
              questions or need assistance, feel free to reach out.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                pX={20}
                pY={12}
                className="rounded bg-[#00A3FF] text-center text-xs font-semibold text-white no-underline"
                href={href ?? fallbackUrl}
              >
                Get Started
              </Button>
            </Section>
            <Text className="text-sm">
              Cheers,
              <br />
              Podopieczni Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WelcomeEmail;
