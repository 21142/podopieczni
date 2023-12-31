export const setCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${value}; path=/`;
};
