import * as React from 'react';

/**
 * Returns `false` during SSR and the first client render, then `true`. Use to
 * gate rendering of LocalStorage-backed UI so server and client markup match.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}
