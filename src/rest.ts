import { AuthService, UninitializedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";

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
    const jwtPayload = JSON.parse(globalThis.atob(this.#token.split(".")[1]));
    const exp = jwtPayload.exp as number;
    return Date.now() < exp * 1000;
  }

  async #refreshToken() {
    this.#token = await this.#authService.refresh();
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
    if (!this.#hasValidToken()) {
      await this.#refreshToken();
    }
    return await communicateRestApi(
      url,
      { method },
      { body, token: this.#token }
    );
  }

  async requestRestApi2json({
    body,
    method,
    restUrl,
  }: {
    body?: object;
    method: string;
    restUrl: string;
  }) {
    const res = await this.requestRestApi({ restUrl, method, body });
    if (res.ok) {
      return await res.json();
    } else {
      throw Error(res.statusText);
    }
  }
}

export default RestService;
