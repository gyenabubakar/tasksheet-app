import React, { createContext, useMemo, useState } from 'react';
import { User } from 'firebase/auth';

interface Props {
  initialVue: User;
}

interface UserContextValue {
  user: User;
  updateUser: (user: User) => void;
}

export const UserContext = createContext<UserContextValue | null>(null);
UserContext.displayName = 'UserContext';

const UserContextProvider: React.FC<Props> = ({ children, initialVue }) => {
  const [user, setUser] = useState<User>(() => initialVue);

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      updateUser(u) {
        setUser({
          ...user,
          ...u,
        });
      },
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
