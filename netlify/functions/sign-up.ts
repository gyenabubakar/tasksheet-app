import { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  const message = 'Signup';

  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};
