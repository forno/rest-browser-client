import { AuthService, UninitializedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";
// @ts-ignore
import { decode } from 'js-base64';

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
    const jwtPayload = JSON.parse(decode(this.#token.split(".")[1]));
    const exp = jwtPayload.exp as number;
    return Date.now() < exp * 1000;
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
        this.#token = await this.#authService.refresh();
      } catch (e) {
        if (!(e instanceof UninitializedRefreshTokenError)) {
          throw e;
        }
        err = e;
      }
    }
    try {
      return await communicateRestApi(
        url,
        { method },
        { body, token: this.#token }
      );
    } catch (e) {
      if (err != null) {
        throw err;
      }
      throw e;
    }
  }
}

export default RestService;
