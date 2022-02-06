import { FormEvent, useState } from 'react';
import Head from 'next/head';
import validator from 'validator';

import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';
import { ResetPasswordEmailInfo } from '~/_serverless/lib/types';
import EmailForm from '~/components/page-reset-password/EmailForm';

const ResetPasswordPage: PageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = !email ? null : validator.isEmail(email);

  function handleConfirmEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (emailIsValid && !submitting) {
      const form: ResetPasswordEmailInfo = {
        email,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
      }, 3000);
    }
  }

  return (
    <>
      <Head>
        <title>Reset Password | TaskSheet</title>
      </Head>

      <main>
        <Container>
          <EmailForm
            handleConfirmEmail={(e: FormEvent<HTMLFormElement>) =>
              handleConfirmEmail(e)
            }
            submitting={submitting}
            emailIsValid={emailIsValid}
            email={email}
            setEmail={setEmail}
          />
        </Container>
      </main>
    </>
  );
};

ResetPasswordPage.layout = 'auth';

export default ResetPasswordPage;
