export class UninitalizedRefreshTokenError extends Error {
  constructor(...args) {
    super(...args);

    Object.defineProperty(this, "name", {
      configurable: true,
      enumerable: false,
      value: "UninitalizedRefreshTokenError",
      writable: true,
    });

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UninitalizedRefreshTokenError);
    }
  }
}

export class AuthService {
  constructor() {
    throw SyntaxError("FYI: AuthService is a interface class");
  }

  async refresh() {
    throw SyntaxError("FYI: AuthService is a interface class");
  }
}

export default AuthService;
