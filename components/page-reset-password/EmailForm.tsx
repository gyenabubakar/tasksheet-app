import React, { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { AuthErrorCodes, getAuth, sendPasswordResetEmail } from 'firebase/auth';

import illustrationResetPassword from '~/assets/illustrations/reset-password.svg';
import Input from '~/components/common/Input';
import iconEmail from '~/assets/icons/email.svg';
import Button from '~/components/common/Button';
import useFormValidation from '~/hooks/useFormValidation';
import validator from 'validator';
import { useRouter } from 'next/router';
import swal from '~/assets/ts/sweetalert';

interface Props {
  handleEmailFormSubmitted: () => void;
}

const EmailForm: React.FC<Props> = () => {
  const router = useRouter();

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
      setSubmitting(true);

      sendPasswordResetEmail(getAuth(), email, {
        url: `http://${window.location.host}/login`,
      })
        .then(() => {
          swal({
            icon: 'success',
            title: 'Email sent!',
            html: `<span>
                We sent an email to <span class="text-main font-medium">${email}</span>.<br /><br />
                Click on the link in the mail to reset your password.<br /><br/>
                Check your Spam folder if it's not in your inbox.
              </span>`,
          });
          router.push('/login');
        })
        .catch((err) => {
          if (err.message.includes(AuthErrorCodes.NETWORK_REQUEST_FAILED)) {
            swal({
              icon: 'error',
              title:
                "Couldn't make request. Check your connection and try again.",
            });
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
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

        <p className="text-darkgray text-center mt-5 max-w-[450px] mx-auto">
          Enter the email you created your account with.&nbsp;
          <br className="hidden md:block" /> If the account exists, we’ll send
          you an email with instructions on how to reset your password.
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
