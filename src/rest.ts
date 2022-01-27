import { AuthService, UninitializedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";
import { decode } from "./libs/base64.js";

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
    const res = await this.#communicate({ body, method, url });
    if (res.status !== 401 || this.#hasValidToken()) {
      return res;
    }
    await this.#refresh();
    return await this.#communicate({ body, method, url });
  }
}

export default RestService;
