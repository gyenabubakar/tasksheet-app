import React, { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';

import illustrationResetPassword from '~/assets/illustrations/reset-password.svg';
import Input from '~/components/common/Input';
import iconEmail from '~/assets/icons/email.svg';
import Button from '~/components/common/Button';
import useFormValidation from '~/hooks/useFormValidation';
import { ResetPasswordEmailInfo } from '~/_serverless/lib/types';
import validator from 'validator';

interface Props {
  handleEmailFormSubmitted: () => void;
}

const EmailForm: React.FC<Props> = ({ handleEmailFormSubmitted }) => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const emailIsValid = !email ? null : validator.isEmail(email);

  const { errors } = useFormValidation<{ email: string | null }>(
    {
      email: null,
    },
    [emailIsValid],
    [
      'Password must be at least 6 characters long with at least 1 uppercase and lowercase letter, 1 number and 1 symbol.',
      "Passwords aren't the same.",
    ],
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
        handleEmailFormSubmitted();
      }, 3000);
    }
  }

  return (
    <form
      onSubmit={handleConfirmEmail}
      autoComplete="off"
      className="signup-form width-max-content mx-auto bg-white pt-10 pb-16 md:p-16 mb-20 rounded-large"
    >
      <div className="form-head mb-10">
        <h1 className="text-[36px] font-bold text-center">Reset Password</h1>

        <div className="max-w-[168px] h-[158px] relative mx-auto my-12">
          <Image src={illustrationResetPassword} layout="fill" />
        </div>

        <p className="text-darkgray text-center mt-5">
          Enter the email you created your account with.{' '}
          <br className="hidden md:block" /> If the account exists, we’ll send
          you a <span className="text-fakeblack font-medium">5-digit</span>{' '}
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

      <div className="flex justify-center mt-10">
        <Button
          type="submit"
          loading={submitting}
          disabled={submitting || !emailIsValid}
        >
          {submitting ? 'Sending...' : 'Send email'}
        </Button>
      </div>
    </form>
  );
};

export default EmailForm;
