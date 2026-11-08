import { Container } from '@/components/layout/Container';
import { RouteLoading } from '@/components/ui/RouteLoading';

export default function BooksLoading() {
  return (
    <Container>
      <RouteLoading label="Opening the shelf." />
    </Container>
  );
}