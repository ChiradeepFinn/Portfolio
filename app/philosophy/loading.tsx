import { Container } from '@/components/layout/Container';
import { RouteLoading } from '@/components/ui/RouteLoading';

export default function PhilosophyLoading() {
  return (
    <Container>
      <RouteLoading label="Opening the shelf." />
    </Container>
  );
}
