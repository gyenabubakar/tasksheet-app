import { Handler } from '@netlify/functions';
import HTTPMethod from 'http-method-enum';
import validator from 'validator';
import { StatusCodes } from 'http-status-codes';

import validateRequest from '~/netlify/lib/utils/validateRequest';
import supportedHttpMethods from '~/netlify/lib/methods';
import FirebaseAuth from '~/netlify/firebase/auth';
import getRequestBody from '~/netlify/lib/utils/getRequestBody';
import { SignupInfo } from '~/netlify/lib/types';

export const handler: Handler = async (event) => {
  const errorResponse = validateRequest(
    [HTTPMethod.POST],
    supportedHttpMethods[event.httpMethod],
    event.body,
  );
  if (errorResponse) {
    return errorResponse;
  }

  const { email, password, confirmPassword, name } = getRequestBody<SignupInfo>(
    event.body,
  )!;

  const errors: { [p: string]: string } = {};

  if (!validator.isEmail(email)) {
    errors.email = 'Invalid email address.';
  }
  if (password === '') {
    errors.password = 'Password is required.';
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
  ) {
    errors.password = "Password isn't strong.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords aren't the same.";
  }
  if (!name.length) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Invalid name.';
  }
  if (Object.entries(errors).length > 0) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify(errors),
    };
  }

  try {
    const user = await FirebaseAuth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
    });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify(error),
    };
  }
};
