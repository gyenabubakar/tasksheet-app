const parseCookie = <T = { [key: string]: string }>(str: string): T | null => {
  const cookies = str.split(';');
  if (!cookies.length) {
    return null;
  }

  let cookieObj = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split('=');
    cookieObj = {
      ...cookieObj,
      [key]: value,
    };
  });

  return cookieObj as T;
};

export default parseCookie;
