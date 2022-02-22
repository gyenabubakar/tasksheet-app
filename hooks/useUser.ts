import { useContext } from 'react';
import { UserContext } from '~/context/UserContextProvider';

function useUser() {
  const value = useContext(UserContext);
  if (!value?.user) {
    throw new Error('Call useUser() in children of UserContextProvider.');
  }
  return value;
}

export default useUser;
