declare type RequestInfo = any;
declare type RequestInit = any;
export declare const communicateRestApi: (url: RequestInfo, init: Omit<RequestInit, "body" | "headers">, options?: {
    body?: object | undefined;
    token?: string | undefined;
} | undefined) => Promise<any>;
export default communicateRestApi;
