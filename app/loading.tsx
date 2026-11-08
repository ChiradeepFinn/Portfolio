import { Container } from '@/components/layout/Container';
import { RouteLoading } from '@/components/ui/RouteLoading';

export default function RootLoading() {
  return (
    <Container>
      <RouteLoading label="Opening the page." hint="One moment while the next view arrives." />
    </Container>
  );
}
