import { ChangeEvent, FormEvent, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import validator from 'validator';

import { PageWithLayout } from '~/assets/ts/types';
import Input from '~/components/common/Input';
import useFormValidation from '~/hooks/useFormValidation';
import Container from '~/components/common/Container';
import iconEmail from '~/assets/icons/email.svg';
import illustrationResetPassword from '~/assets/illustrations/reset-password.svg';
import Button from '~/components/common/Button';
import { ResetPasswordEmailInfo } from '~/_serverless/lib/types';

const ResetPasswordPage: PageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = !email ? null : validator.isEmail(email);

  const { errors } = useFormValidation<{ email: string | null }>(
    {
      email: null,
    },
    [emailIsValid],
    ['Enter a valid email address.'],
  );

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
          <form
            onSubmit={handleConfirmEmail}
            autoComplete="off"
            className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
          >
            <div className="form-head mb-10">
              <h1 className="text-[36px] font-bold text-center">
                Reset Password
              </h1>

              <div className="max-w-[168px] h-[158px] relative mx-auto my-12">
                <Image src={illustrationResetPassword} layout="fill" />
              </div>

              <p className="text-darkgray text-center mt-5">
                Enter the email you created your account with. <br /> If the
                account exists, we’ll send you a{' '}
                <span className="text-fakeblack font-medium">5-digit</span>{' '}
                code.
              </p>
            </div>

            <Input
              id="email"
              type="email"
              value={email}
              label="Email"
              wrapperClass="mb-1.5 mx-auto"
              error={errors.email}
              icon={{
                position: 'left',
                elements: [
                  <div className="absolute bottom-[0.55rem] left-[1.125rem]">
                    <Image
                      src={iconEmail}
                      width="22px"
                      height="18px"
                      alt="User icon"
                    />
                  </div>,
                ],
              }}
              placeholder="Enter email address"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />

            <div className="text-center mt-10">
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting || !emailIsValid}
              >
                {submitting ? 'Sending...' : 'Send email'}
              </Button>
            </div>
          </form>
        </Container>
      </main>
    </>
  );
};

ResetPasswordPage.layout = 'auth';

export default ResetPasswordPage;
