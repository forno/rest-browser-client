export class UninitalizedRefreshTokenError extends Error {
  constructor(...args: any) {
    super(...args);

    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    });

    this.stack = new Error().stack;
  }
}

export interface AuthService {
  refresh(): Promise<string>;
}

export default AuthService;
