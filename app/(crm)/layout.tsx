import type { ReactNode } from 'react';
import CrmSessionProvider from '@/components/crm/CrmSessionProvider';

export default function CrmLayout({ children }: { children: ReactNode }) {
  return <CrmSessionProvider>{children}</CrmSessionProvider>;
}
