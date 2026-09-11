'use client';

import { useSyncExternalStore } from 'react';
import { Toaster } from 'sonner';

const subscribe = () => () => {};

export function ClientToaster() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  if (!mounted) return null;
  return <Toaster position="bottom-right" richColors />;
}
