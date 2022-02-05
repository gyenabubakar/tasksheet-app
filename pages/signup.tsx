import { NextPage } from 'next';
import Head from 'next/head';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Input from '~/components/common/Input';

const SignupPage: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignup(e: FormEvent<HTMLFormElement>) {
    console.log(e);
  }

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
            maxLength={255}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
            }}
          />
          <Input
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </form>
      </main>
    </>
  );
};

export default SignupPage;
