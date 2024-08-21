import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { FC, ReactNode } from 'react';
import { ThemeProvider } from './ThemeProvider';

const AppProviders: FC<{
  session: Session | null;
  children: ReactNode;
}> = ({ session, children }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default AppProviders;
