import { NextMiddleware, NextResponse } from 'next/server';

export const middleware: NextMiddleware = (request) => {
  if (!request.cookies.accessToken) {
    return NextResponse.redirect(
      `/login?redirect=${encodeURIComponent(request.nextUrl.pathname)}`,
    );
  }

  return NextResponse.next();
};
