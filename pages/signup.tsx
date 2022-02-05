import { NextPage } from 'next';
import Head from 'next/head';
import React, {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  ReactEventHandler,
  useState,
} from 'react';
import Input from '~/components/common/Input';

const SignupPage: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignup(e: React.FormEvent<HTMLFormElement>) {}

  return (
    <>
      <Head>
        <title>Sign up - TaskSheet</title>
        <meta
          name="description"
          content="Sign up for an account on TaskSheet and start managing your projects."
        />
      </Head>

      <main>
        <form onSubmit={handleSignup}>
          <Input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
        </form>
      </main>
    </>
  );
};

export default SignupPage;
