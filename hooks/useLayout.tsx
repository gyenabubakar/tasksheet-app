import React, { useCallback } from 'react';

import { AppLayout as LayoutType } from '~/assets/ts/types';
import AuthLayout from '~/components/layouts/AuthLayout';
import AppLayout from '~/components/layouts/AppLayout';

const useLayout = (layout: LayoutType | undefined) => {
  const Layout = useCallback<React.FC>(
    ({ children }) => {
      let LayoutElement: JSX.Element;

      switch (layout) {
        case 'auth':
          LayoutElement = <AuthLayout>{children}</AuthLayout>;
          break;
        case 'app':
          LayoutElement = <AppLayout>{children}</AppLayout>;
          break;
        default:
          LayoutElement = <div>{children}</div>;
      }
      return LayoutElement;
    },
    [layout],
  );

  return Layout;
};

export default useLayout;
