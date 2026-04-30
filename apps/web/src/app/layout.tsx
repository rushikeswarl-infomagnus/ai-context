import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'ACME Platform',
  description: 'ACME Monorepo Web App',
};

const RootLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
