import React, { useState } from 'react';
import Head from 'next/head';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Head>
        <title>Log in | TaskSheet</title>
      </Head>

      <main />
    </>
  );
};
export default Login;
