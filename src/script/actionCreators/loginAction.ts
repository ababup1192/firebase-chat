import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";
import {UserInfo} from "../definitions/userInfo";

const LOGIN = "LOGIN";

export class LoginAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public login(userInfo: UserInfo) {
        this.d.push(LOGIN, userInfo);
    }

    public end() {
        this.d.stream(LOGIN).end();
    }

    public createProperty(): Bacon.Property<UserInfo, UserInfo> {
        return Bacon.update<UserInfo, UserInfo, UserInfo>(new UserInfo(),
            [this.d.stream(LOGIN)], this._login.bind(this)
        );
    }

    private _login(old: UserInfo, newUserInfo: UserInfo): UserInfo {
        return newUserInfo;
    }
}