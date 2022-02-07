import React, { ChangeEvent, FormEvent, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import validator from 'validator';

import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import { LoginInfo } from '~/_serverless/lib/types';
import Container from '~/components/common/Container';
import Input from '~/components/common/Input';
import iconEmail from '~/assets/icons/email.svg';
import iconLock from '~/assets/icons/lock.svg';
import Link from 'next/link';
import { PageWithLayout } from '~/assets/ts/types';
import Button from '~/components/common/Button';

interface FormErrors extends FormValidationErrors {
  email: string | null;
  password: string | null;
}

const LoginPage: PageWithLayout = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [passwordIsMasked, setPasswordIsMasked] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = !email ? null : validator.isEmail(email);
  const passwordIsValid = password ? password.length > 5 : null;
  const formIsValid = !!emailIsValid && !!passwordIsValid;

  const { errors } = useFormValidation<FormErrors>(
    {
      email: null,
      password: null,
    },
    [emailIsValid, passwordIsValid],
    [
      'Enter a valid email address.',
      'Password must be at least 6 characters long.',
    ],
  );

  function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const form: LoginInfo = {
        email,
        password,
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
        <title>Log in · TaskSheet</title>
      </Head>

      <main>
        <Container>
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
          >
            <div className="form-head mb-10">
              <h1 className="text-[36px] font-bold text-center">Log in</h1>
              <p className="text-darkgray text-center mt-5">
                Get back to managing your projects.
              </p>
            </div>

            <div className="form-body">
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
              <Input
                id="password"
                type={passwordIsMasked ? 'password' : 'text'}
                value={password}
                label="Password"
                wrapperClass="mb-1.5 mx-auto"
                error={errors.password}
                icon={{
                  position: 'both',
                  elements: [
                    <div className=" absolute bottom-[0.55rem] left-[1.125rem]">
                      <Image
                        src={iconLock}
                        width="22px"
                        height="20px"
                        alt="User icon"
                      />
                    </div>,

                    <button
                      type="button"
                      className="text-sm uppercase font-bold text-main inline-block absolute bottom-[0.95rem] right-[1.125rem] "
                      onClick={() => setPasswordIsMasked((state) => !state)}
                    >
                      {passwordIsMasked ? 'Show' : 'Hide'}
                    </button>,
                  ],
                }}
                placeholder="Enter a strong password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
              />

              <div className="text-right">
                <Link href="/reset-password">
                  <a className="text-main font-medium hover:text-dark-main">
                    Forgot Password?
                  </a>
                </Link>
              </div>

              <div className="text-center mt-10">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting || !formIsValid}
                >
                  {submitting ? 'Hang on...' : 'Log in'}
                </Button>
              </div>
            </div>
          </form>
        </Container>
      </main>
    </>
  );
};

LoginPage.layout = 'auth';

export default LoginPage;
