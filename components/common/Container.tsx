import React from 'react';

type Props = Partial<React.HTMLProps<HTMLDivElement>>;

const Container: React.FC<Props> = ({ children, className, ...props }) => (
  <div
    className={`Container w-full px-3 md:px-0 mx-auto sm:w-[540px] md:w-[740px] lg:w-[960px] xl:w-[1140px] ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Container;
