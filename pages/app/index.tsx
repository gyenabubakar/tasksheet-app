import Head from 'next/head';
import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';

const LoggedInHomePage: PageWithLayout = () => {
  const message = 'Dashboard';

  return (
    <>
      <Head>
        <title>Dashboard · TaskSheet</title>
      </Head>

      <Container>
        <h1>{message}</h1>
      </Container>
    </>
  );
};

LoggedInHomePage.layout = 'app';

export default LoggedInHomePage;
