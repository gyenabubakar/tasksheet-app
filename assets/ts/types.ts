import { NextPage } from 'next';

// 'auth' - for authentication pages (signup, login, verification, reset password).
// 'app' - for the app interface after user is logged in
export type AppLayout = 'auth' | 'app';

export type PageWithLayout = NextPage & {
  layout?: AppLayout;
};
