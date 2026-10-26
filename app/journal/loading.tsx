import { Container } from '@/components/layout/Container';

export default function JournalLoading() {
  return (
    <Container className="pt-36 pb-20 sm:pt-44">
      <p className="eyebrow text-accent-blue">Guest journal</p>
      <p className="mt-6 text-sm text-muted">Opening the journal.</p>
      <div className="mt-16 grid gap-8 border-t border-border pt-8" aria-hidden="true">
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
      </div>
    </Container>
  );
}
