import { AuthService, UninitalizedRefreshTokenError } from "./auth";
import { communicateRestApi } from "./communicate";

export class RestService {
  private _baseUrl: string;
  private _authService: AuthService;

  constructor(baseUrl: string, authService: AuthService) {
    this._baseUrl = baseUrl;
    this._authService = authService;
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
    const url = `${this._baseUrl}${restUrl}`;
    try {
      const token = await this._authService.refresh();
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
