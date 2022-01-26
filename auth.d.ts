export declare class UninitializedRefreshTokenError extends Error {
    constructor(...args: any);
}
export interface AuthService {
    refresh(): Promise<string>;
}
export default AuthService;
