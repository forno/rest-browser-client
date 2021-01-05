import { UninitalizedRefreshTokenError } from "./auth.js";
import { communicateRestApi } from "./communicate.js";

export class RestService {
  #baseUrl;
  #authService;

  constructor(baseUrl, authService) {
    this.#baseUrl = baseUrl;
    this.#authService = authService;
  }

  async requestRestApi({ body, method, restUrl }) {
    const url = `${this.#baseUrl}${restUrl}`;
    try {
      const token = await this.#authService.refresh();
      return await communicateRestApi(url, { method }, { body, token });
    } catch (e) {
      if (!(e instanceof UninitalizedRefreshTokenError)) {
        throw e; // refreshTokenが存在するのにエラーならその例外をthrow
      }
      // RefreshTokenが無い場合はtoken無で通信を試みる
      const res = await communicateRestApi(url, { method }, { body });
      if (!res.ok) {
        throw e; // どんな通信エラーだったとしてもrefreshTokenが無かったことを通知
      }
      return res;
    }
  }

  async requestRestApi2json({ body, method, restUrl }) {
    const res = await this.requestRestApi({ restUrl, method, body });
    if (res.ok) {
      return await res.json();
    } else {
      throw Error(res.statusText);
    }
  }
}

export default RestService;
