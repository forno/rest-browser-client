export class UninitalizedRefreshTokenError extends Error {
  constructor(...args: any) {
    super(...args);

    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UninitalizedRefreshTokenError);
    }
  }
}

export interface AuthService {
  readonly refreshToken: string;

  refresh(): Promise<string>;
  signin(credentials: object): Promise<void>;
  signout(): void;
}

export default AuthService;
