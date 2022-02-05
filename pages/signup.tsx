import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import validator from 'validator';

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Input from '~/components/common/Input';
import iconUser from '~/assets/icons/user.svg';
import iconEmail from '~/assets/icons/email.svg';
import iconLock from '~/assets/icons/lock.svg';
import Checkbox from '~/components/common/Checkbox';
import { SignupInfo } from '~/_serverless/lib/types';
import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';

interface FormErrors {
  name: string | null;
  email: string | null;
  password: string | null;
}

const SignupPage: PageWithLayout = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);

  const [errors, setErrors] = useState<FormErrors>({
    name: null,
    email: null,
    password: null,
  });

  const [passwordIsMasked, setPasswordIsMasked] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const nameIsValid = !name ? null : name.length > 1;
  const emailIsValid = !email ? null : validator.isEmail(email);
  const passwordIsValid = !password
    ? null
    : validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      });
  const formIsValid =
    !!nameIsValid && !!emailIsValid && !!passwordIsValid && agreedToPolicy;

  useEffect(() => {
    if (nameIsValid === false) {
      setErrors((prevState) => ({
        ...prevState,
        name: 'Enter a valid name.',
      }));
      return;
    }

    setErrors((prevState) => ({
      ...prevState,
      name: null,
    }));
  }, [nameIsValid]);

  useEffect(() => {
    if (emailIsValid === false) {
      setErrors((prevState) => ({
        ...prevState,
        email: 'Enter a valid email.',
      }));
      return;
    }

    setErrors((prevState) => ({
      ...prevState,
      email: null,
    }));
  }, [emailIsValid]);

  useEffect(() => {
    if (passwordIsValid === false) {
      setErrors((prevState) => ({
        ...prevState,
        password:
          'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
      }));
      return;
    }

    setErrors((prevState) => ({
      ...prevState,
      password: null,
    }));
  }, [passwordIsValid]);

  function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const form: SignupInfo = {
        name,
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
        <title>Sign up | TaskSheet</title>
        <meta
          name="description"
          content="Sign up for an account on TaskSheet and start managing your projects."
        />
      </Head>

      <main>
        <Container>
          <form
            onSubmit={handleSignup}
            autoComplete="off"
            className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
          >
            <div className="form-head mb-10">
              <h1 className="text-[36px] font-bold text-center">Sign Up</h1>
              <p className="text-darkgray text-center mt-5">
                Create an account and start managing your tasks
                <br className="hidden md:block" /> the right way.
              </p>
            </div>

            <div className="form-body">
              <Input
                id="name"
                value={name}
                maxLength={255}
                label="Full name"
                wrapperClass="mb-1.5"
                error={errors.name}
                placeholder="Enter your full name"
                icon={{
                  position: 'left',
                  elements: [
                    <div className="absolute bottom-[0.55rem] left-[1.125rem]">
                      <Image
                        src={iconUser}
                        width="19px"
                        height="21px"
                        alt="User icon"
                      />
                    </div>,
                  ],
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setName(e.target.value);
                }}
              />
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

              <div className="privacy-policy max-w-[95%] md:w-[450px] mx-auto">
                <div className="flex">
                  <Checkbox
                    isChecked={agreedToPolicy}
                    toggle={() => setAgreedToPolicy((prevState) => !prevState)}
                  />
                  <span
                    className="inline-block ml-3 cursor-default"
                    onClick={() => setAgreedToPolicy((prevState) => !prevState)}
                  >
                    I agree to our{' '}
                    <Link href="/privacy-policy">
                      <a className="text-main pb-1 border-b-[3px] border-white hover:border-main">
                        Privacy Policy
                      </a>
                    </Link>
                    .
                  </span>
                </div>

                <div className={!agreedToPolicy ? 'visible' : 'invisible'}>
                  <span className="text-red-600 text-sm min-h-[5px] inline-block font-medium">
                    {!agreedToPolicy &&
                      'You must read and accept our privacy policy.'}
                  </span>
                </div>
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

                  {submitting ? 'Hang on...' : 'Sign up'}
                </button>
              </div>
            </div>
          </form>
        </Container>
      </main>
    </>
  );
};

SignupPage.layout = 'auth';

export default SignupPage;
