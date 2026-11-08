import { Container } from '@/components/layout/Container';
import { RouteLoading } from '@/components/ui/RouteLoading';

/**
 * Journal suspense fallback. Public chrome only: never slips, composers,
 * or session-owned notes. Auth and wall content wait for the server page.
 */
export default function JournalLoading() {
  return (
    <Container>
      <RouteLoading
        label="Opening the journal."
        hint="Checking the room. Sign-in and notes arrive after this."
      />
      <div className="mt-14 grid gap-8 border-t border-border pt-8" aria-hidden="true">
        <div className="h-px bg-border" />
        <div className="h-px max-w-md bg-border" />
        <div className="h-px max-w-xs bg-border" />
      </div>
    </Container>
  );
}
