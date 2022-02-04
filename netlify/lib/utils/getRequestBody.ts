function getRequestBody<T>(body: string | null): T | null {
  let parsedBody: T;
  if (body) {
    parsedBody = JSON.parse(body) as T;
    return parsedBody;
  }
  return null;
}

export default getRequestBody;
