import { AuthService } from "./auth.js";
export declare class RestService {
    #private;
    constructor(baseUrl: string, authService: AuthService);
    requestRestApi({ body, method, restUrl, }: {
        body?: object;
        method: string;
        restUrl: string;
    }): Promise<any>;
}
export default RestService;
