import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

import {IUserInfo} from "../definition/definitions";
import {UserInfoUtil} from "../utils/userInfo";

const UPDATE = "UPDATE";
const REFRESH = "REFRESH";

export class LoginStatusAction {
    private d: Dispatcher;
    private loginStatusRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, loginStatusRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.loginStatusRef = loginStatusRef;
    }

    public update(userInfo: IUserInfo) {
        this.d.push(UPDATE, userInfo);
    }

    public refresh() {
        this.d.push(REFRESH, null);
    }

    public end() {
        this.d.stream(UPDATE).end();
        this.d.stream(REFRESH).end();
    }

    public createProperty(): Bacon.Property<IUserInfo, IUserInfo> {
        return Bacon.update<IUserInfo, IUserInfo, any, IUserInfo>({ uid: "", photoURL: "", displayName: "", updateTime: new Date() },
            [this.d.stream(UPDATE)], this._update.bind(this),
            [this.d.stream(REFRESH)], this._refresh.bind(this)
        );
    }

    private _update(old: IUserInfo, newUserInfo: IUserInfo): IUserInfo {
        console.log("update");
        this.loginStatusRef.child(newUserInfo.uid).set(UserInfoUtil.toFirebaseUserInfo(newUserInfo));
        return newUserInfo;
    }

    private _refresh(old: IUserInfo, ignore: any): IUserInfo {
        this.loginStatusRef.once("value", (snapShot) => {
            console.log(snapShot.val());
        });
        return old;
    }
}