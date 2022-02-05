import HTTPMethod from 'http-method-enum';
import type { Response } from '@netlify/functions/dist/function/response';
import { StatusCodes } from 'http-status-codes';
import getRequestBody from '~/.serverless/lib/utils/getRequestBody';

function validateRequest(
  methods: HTTPMethod[],
  methodProvided: HTTPMethod,
  reqBody: null | string = null,
): Response | null {
  let response: Response | null = null;

  if (!methods.includes(methodProvided)) {
    response = {
      statusCode: StatusCodes.METHOD_NOT_ALLOWED,
      body: JSON.stringify({
        message: `Unsupported method: ${methodProvided}`,
      }),
    };
  } else if (reqBody) {
    const body = getRequestBody<object>(reqBody);
    if (!body) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify({
          message: 'Request body not provided!',
        }),
      };
    }
  }

  return response;
}

export default validateRequest;
