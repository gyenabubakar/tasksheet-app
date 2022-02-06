import React, { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import validator from 'validator';

import iconLock from '~/assets/icons/lock.svg';
import Input from '~/components/common/Input';
import useFormValidation from '~/hooks/useFormValidation';
import { ResetPasswordPasswordsInfo } from '~/_serverless/lib/types';
import Button from '~/components/common/Button';

interface Props {
  handleSubmittedPasswords: () => void;
}

type ValidationErrorsProperties = {
  password: string | null;
  confirmPassword: string | null;
};

const PasswordForm: React.FC<Props> = ({ handleSubmittedPasswords }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [passwordIsMasked, setPasswordIsMasked] = useState(true);

  const passwordIsValid = !password
    ? null
    : validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      });
  const passwordsAreEqual = !confirmPassword
    ? null
    : password === confirmPassword;

  const { errors } = useFormValidation<ValidationErrorsProperties>(
    {
      password: null,
      confirmPassword: null,
    },
    [passwordIsValid, passwordsAreEqual],
    [
      'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
      "Passwords aren't the same.",
    ],
  );

  const formIsValid = passwordIsValid && passwordsAreEqual;

  function handleSubmitNewPasswords(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (formIsValid && !submitting) {
      const form: ResetPasswordPasswordsInfo = {
        password,
        confirmPassword,
      };

      setSubmitting(true);
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(form);
        setSubmitting(false);
        handleSubmittedPasswords();
      }, 3000);
    }
  }

  return (
    <form
      onSubmit={handleSubmitNewPasswords}
      autoComplete="off"
      className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
    >
      <div className="form-head mb-10">
        <h1 className="text-[36px] font-bold text-center">Create Password</h1>

        <p className="text-darkgray text-center mt-5">
          Enter a new password for your account.
        </p>
      </div>

      <div className="form-body">
        <Input
          id="password"
          type={passwordIsMasked ? 'password' : 'text'}
          value={password}
          label="New Password"
          placeholder="Enter new password"
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
        />

        <Input
          id="confirm-password"
          type={passwordIsMasked ? 'password' : 'text'}
          value={confirmPassword}
          label="Confirm Password"
          placeholder="Repeat new password"
          wrapperClass="mb-1.5 mx-auto"
          error={errors.confirmPassword}
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>

      <div className="text-center mt-10">
        <Button
          type="submit"
          loading={submitting}
          disabled={submitting || !formIsValid}
        >
          {submitting ? 'Saving...' : 'Save Password'}
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
