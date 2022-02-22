import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import validator from 'validator';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  AuthErrorCodes,
} from 'firebase/auth';

import React, { ChangeEvent, FormEvent, useState } from 'react';
import Input from '~/components/common/Input';
import iconUser from '~/assets/icons/user.svg';
import iconEmail from '~/assets/icons/email.svg';
import iconLock from '~/assets/icons/lock.svg';
import Checkbox from '~/components/common/Checkbox';
import { PageWithLayout } from '~/assets/ts/types';
import Container from '~/components/common/Container';
import useFormValidation, {
  FormValidationErrors,
} from '~/hooks/useFormValidation';
import Button from '~/components/common/Button';
import FormValidation from '~/assets/ts/form-validation';
import { useRouter } from 'next/router';
import swal from '~/assets/ts/sweetalert';
import { spans } from 'next/dist/build/webpack/plugins/profiling-plugin';

interface FormErrors extends FormValidationErrors {
  name: string | null;
  email: string | null;
  password: string | null;
}

const SignupPage: PageWithLayout = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [passwordIsMasked, setPasswordIsMasked] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const nameIsValid = !name ? null : FormValidation.isValidName(name);
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
  const formIsValid = !!nameIsValid && !!emailIsValid && !!passwordIsValid;

  const { errors } = useFormValidation<FormErrors>(
    {
      name: null,
      email: null,
      password: null,
    },
    [nameIsValid, emailIsValid, passwordIsValid],
    [
      'Enter a valid name.',
      'Enter a valid email address.',
      'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
    ],
  );

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const auth = getAuth();
      setGeneralError(null);

      try {
        setSubmitting(true);
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await updateProfile(userCred.user, { displayName: name.trim() });
        await sendEmailVerification(userCred.user, {
          url: `http://${window.location.host}/login`,
        });
        await signOut(auth);
        await router.push('/login').then(() => {
          swal({
            icon: 'success',
            title: 'Account created successfully!',
            html: `<span>
                We sent a verification email to <span class="text-main font-medium">${email}</span>. <br /><br />
                Click on the link in your inbox to verify your account.
              </span>`,
          });
        });
      } catch (error: any) {
        if (error) {
          if (error.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
            setGeneralError('An account with this email already exists.');
          } else if (
            error.message.includes(AuthErrorCodes.NETWORK_REQUEST_FAILED)
          ) {
            setGeneralError(
              "Couldn't make request. Check your connection and try again.",
            );
          }
          setSubmitting(false);
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Sign up · TaskSheet</title>
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
                <br className="hidden md:block" /> the easy way.
              </p>
            </div>

            <div className="form-body">
              <Input
                id="name"
                value={name}
                maxLength={255}
                label="Full name"
                wrapperClass="mb-1.5 mx-auto"
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

              <div className="privacy-policy hidden max-w-[95%] md:w-[450px] mx-auto">
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

              <div className="text-center">
                {generalError && (
                  <span className="text-base font-medium text-red-500">
                    {generalError}
                  </span>
                )}
              </div>

              <div className="flex justify-center mt-10">
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting || !formIsValid}
                >
                  {submitting ? 'Hang on...' : 'Sign up'}
                </Button>
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
