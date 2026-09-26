import { lazy, Suspense, type ReactNode } from 'react';

const PluridLink = lazy(async () => {
  const module = await import('@plurid/plurid-react');
  return { default: module.PluridLink };
});
export function SpatialRecordLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Suspense fallback={<span>{children}</span>}>
      <PluridLink
        className="spatial-link"
        route={'/record/' + encodeURIComponent(id)}
        preview={false}
        suffix=""
      >
        {children}
      </PluridLink>
    </Suspense>
  );
}
export function SpatialSourceLink({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Suspense fallback={<span>{children}</span>}>
      <PluridLink
        className="spatial-link"
        route={'/source/' + encodeURIComponent(id)}
        preview={false}
        suffix=""
      >
        {children}
      </PluridLink>
    </Suspense>
  );
}
