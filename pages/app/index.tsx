import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';

const LoggedInHomePage: PageWithLayout = () => (
  <Container>
    <h1>Home page</h1>
  </Container>
);

LoggedInHomePage.layout = 'app';

export default LoggedInHomePage;
