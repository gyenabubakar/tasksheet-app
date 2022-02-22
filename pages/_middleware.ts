import { NextMiddleware, NextResponse } from 'next/server';

export const middleware: NextMiddleware = (request) => {
  if (
    request.page.name &&
    !/^\/app/.test(request.page.name) &&
    request.cookies.accessToken
  ) {
    return NextResponse.redirect(`/app/`);
  }

  return NextResponse.next();
};
