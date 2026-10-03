'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

/**
 * adalah komponent loading ketika navigasi pindah halaman
 * @param param0
 * @returns
 */
export const ProgressBarProviders = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#16a34a"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};
