'use client';

import { DevTools } from 'jotai-devtools';
import 'jotai-devtools/styles.css';

export default function JotaiProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DevTools position="bottom-right" />
      {children}
    </>
  );
}
