import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";
import {IUserInfo} from "./twitterLoginAction";

const LOGIN = "LOGIN";

export class LoginAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public login(userInfo: IUserInfo) {
        this.d.push(LOGIN, userInfo);
    }

    public end() {
        this.d.stream(LOGIN).end();
    }

    public createProperty(): Bacon.Property<IUserInfo, IUserInfo> {
        return Bacon.update<IUserInfo, IUserInfo, IUserInfo>({ uid: "", photoURL: "", displayName: "" },
            [this.d.stream(LOGIN)], this._login.bind(this)
        );
    }

    private _login(old: IUserInfo, newUserInfo: IUserInfo): IUserInfo {
        return newUserInfo;
    }
}