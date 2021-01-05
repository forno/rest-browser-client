export const communicateRestApi = async (url, init, options) =>
  await fetch(url, {
    ...init,
    body: JSON.stringify(options?.body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options?.token}`,
    },
  });

export default communicateRestApi;
