import { AuthService, UninitializedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";
import { decode } from './libs/base64.js'

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

  async #refresh() {
    this.#token = await this.#authService.refresh();
  }

  async #communicate({
    body,
    method,
    url,
  }: {
    body?: object;
    method: string;
    url: string;
  }) {
    return await communicateRestApi(
      url,
      { method },
      { body, token: this.#token }
    );
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

    if (!this.#hasValidToken()) {
      try {
        await this.#refresh();
      } catch (e) {
        if (!(e instanceof UninitializedRefreshTokenError)) {
          throw e;
        }
        err = e;
      }
    }

    try {
      return await this.#communicate({ body, method, url });
    } catch (e) {
      if (this.#hasValidToken()) {
        throw e;
      }
      try {
        await this.#refresh();
        return await this.#communicate({ body, method, url });
      } catch (e2) {
        if (err != null) {
          throw err;
        }
        throw e2;
      }
    }
  }
}

export default RestService;
