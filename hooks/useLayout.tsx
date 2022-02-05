import { AppLayout } from '~/assets/ts/types';
import React, { useCallback } from 'react';
import AuthLayout from '~/components/layouts/AuthLayout';

const useLayout = (layout: AppLayout | undefined) => {
  const Layout = useCallback<React.FC>(
    ({ children }) => {
      let LayoutElement: JSX.Element;

      switch (layout) {
        case 'auth':
          LayoutElement = <AuthLayout>{children}</AuthLayout>;
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
