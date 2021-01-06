declare type RequestInfo = any;
declare type RequestInit = any;
declare function fetch(url: RequestInfo, init: RequestInit): Promise<any>;

export const communicateRestApi = async (
  url: RequestInfo,
  init: Omit<RequestInit, "body" | "headers">,
  options?: {
    body?: object;
    token?: string;
  }
) =>
  await fetch(url, {
    ...init,
    body: JSON.stringify(options?.body),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options?.token}`,
    },
  });

export default communicateRestApi;
