import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const message = 'Sign up';

  console.log(process.env.FIREBASE_PRIVATE_KEY);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};
