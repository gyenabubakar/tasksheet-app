import { NextMiddleware, NextResponse } from 'next/server';

export const middleware: NextMiddleware = (request) => {
  console.log(request.page.name);
  if (
    request.page.name &&
    /^\/app\//.test(request.page.name) &&
    !request.cookies.accessToken
  ) {
    console.log('hi');
    return NextResponse.redirect(
      `/login?redirect=${encodeURIComponent(request.nextUrl.pathname)}`,
    );
  }

  return NextResponse.next();
};
