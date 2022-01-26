import { AuthService, UninitializedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";

const decode = globalThis.atob;

export class RestService {
  #baseUrl: string;
  #authService: AuthService;
  #token?: string;

  constructor(baseUrl: string, authService: AuthService) {
    this.#baseUrl = baseUrl;
    this.#authService = authService;
    this.#token = undefined;
  }

  #hasValidToken() {
    if (this.#token == null) {
      return false;
    }
    const jwtPayload = JSON.parse(decode(this.#token.split(".")[1])) as {
      exp: number;
    };
    return Date.now() < jwtPayload.exp * 1000;
  }

  async requestRestApi({
    body,
    method,
    restUrl,
  }: {
    body?: object;
    method: string;
    restUrl: string;
  }) {
    const url = `${this.#baseUrl}${restUrl}`;
    let err: UninitializedRefreshTokenError | null = null;
    const refresh = async () => {
      try {
        this.#token = await this.#authService.refresh();
      } catch (e) {
        if (!(e instanceof UninitializedRefreshTokenError)) {
          throw e;
        }
        err = e;
      }
    };

    if (!this.#hasValidToken()) {
      await refresh();
    }
    const communicate = () => {
      return communicateRestApi(url, { method }, { body, token: this.#token });
    };

    try {
      return await communicate();
    } catch (e) {
      if (!this.#hasValidToken()) {
        await refresh();
        try {
          return await communicate();
        } catch (e2) {
          if (err != null) {
            throw err;
          }
          throw e2;
        }
      }
      throw e;
    }
  }
}

export default RestService;
