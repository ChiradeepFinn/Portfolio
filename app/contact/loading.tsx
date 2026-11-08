import { Container } from '@/components/layout/Container';
import { RouteLoading } from '@/components/ui/RouteLoading';

export default function ContactLoading() {
  return (
    <Container>
      <RouteLoading label="Opening contact." hint="The form loads next. Nothing is sent yet." />
    </Container>
  );
}
