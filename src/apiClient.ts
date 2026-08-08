export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const masterPassword = localStorage.getItem("marktivo_master_pwd");
  
  const headers = new Headers(options.headers || {});
  
  if (masterPassword) {
    headers.set("x-master-password", masterPassword);
  }

  return fetch(url, {
    ...options,
    headers
  });
};
