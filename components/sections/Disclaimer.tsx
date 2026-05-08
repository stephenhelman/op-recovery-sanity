import { DisclaimerSection } from '@/types/content';

export default function Disclaimer({ data }: { data: DisclaimerSection }) {
  return (
    <div
      className="px-6 py-6 text-xs text-center opacity-50 max-w-3xl mx-auto"
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
    >
      {data.body}
    </div>
  );
}
