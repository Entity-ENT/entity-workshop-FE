import axios from "axios";
import { User } from "../types/commonTypes";
import { BE_API } from "../config";
import LocalStorageService from "./localStorage/LocalStorageService";
import { LocalStorageKeys } from "./localStorage/LocalStorageKeys";

export class UsersService {
    private readonly _api: string;
    private static _instance: UsersService;

    private constructor(api: string) {
        this._api = api;
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new UsersService(BE_API);
        }
        return this._instance;
    }

    async checkUser(publicAddress: string): Promise<User> {
        debugger;

        return (
            await axios.post<User>(
                `${this._api}/user`,
                { publicAddress },
                {
                    baseURL: BE_API,
                    headers: {
                        Authorization:
                            "Bearer " +
                            LocalStorageService.getItem(LocalStorageKeys.userAuthToken),
                    },
                },
            )
        ).data;
    }

    async updateEmail(userId: string, email: string): Promise<User> {
        return (
            await axios.put<User>(
                `${this._api}/user/${userId}/email`,
                { email },
            )
        ).data;
    }

    async updateUsername(userId: string, username: string): Promise<User> {
        return (
            await axios.put<User>(
                `${this._api}/user/${userId}/username`,
                {
                    username,
                },
            )
        ).data;
    }
}

export default UsersService;
