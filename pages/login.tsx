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
        <title>Log in | TaskSheet</title>
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
                Get back to managing your tasks.
              </p>
            </div>

            <div className="form-body">
              <Input
                id="email"
                type="email"
                value={email}
                label="Email"
                wrapperClass="mb-1.5"
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
                wrapperClass="mb-1.5"
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
                <button
                  type="submit"
                  disabled={!formIsValid}
                  className={`bg-main text-white font-medium px-20 py-4 mx-auto rounded-small flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    submitting || !formIsValid ? '' : 'hover:bg-darkmain'
                  }`}
                >
                  {submitting && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}

                  {submitting ? 'Hang on...' : 'Log in'}
                </button>
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
