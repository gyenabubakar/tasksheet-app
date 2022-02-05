import React from 'react';

type Props = React.HTMLProps<HTMLDivElement>;

const Container: React.FC<Props> = ({ children, className, ...props }) => (
  <div
    className={`container w-full px-2 sm:px-0 sm:mx-auto sm:w-[540px] md:w-[720px] lg:w-[960px] xl:w-[1140px] ${className}`}
  >
    {children}
  </div>
);

export default Container;
