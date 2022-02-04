import HTTPMethod from 'http-method-enum';

const supportedHttpMethods: { [p: string]: HTTPMethod } = {
  POST: HTTPMethod.POST,
  GET: HTTPMethod.GET,
  PUT: HTTPMethod.PATCH,
};

export default supportedHttpMethods;
