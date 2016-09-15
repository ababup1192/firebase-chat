import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

const LOGIN = "LOGIN";
const INNER_LOGIN = "INNER_LOGIN";

export interface IUserInfo {
    uid: string;
    photoURL: string;
    displayName: string;
}

export class TwitterLoginAction {
    private d: Dispatcher;
    private usersRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, userRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.usersRef = userRef;
    }

    public login(userInfo: IUserInfo) {
        this.d.push(LOGIN, userInfo);
    }

    public innerLogin(userInfoList: List<IUserInfo>) {
        this.d.push(INNER_LOGIN, userInfoList);
    }

    public end() {
        this.d.stream(LOGIN).end();
        this.d.stream(INNER_LOGIN).end();
    }

    public createProperty(): Bacon.Property<IUserInfo, List<IUserInfo>> {
        return Bacon.update<IUserInfo, IUserInfo, List<IUserInfo>, List<IUserInfo>>(List<IUserInfo>(),
            [this.d.stream(LOGIN)], this._login.bind(this),
            [this.d.stream(INNER_LOGIN)], this._innerLogin.bind(this)
        );
    }

    private _login(userInfoList: List<IUserInfo>, newUserInfo: IUserInfo): List<IUserInfo> {
        console.log(newUserInfo);
        if (newUserInfo.uid !== "") {
            this.usersRef.child(newUserInfo.uid).set({
                uid: newUserInfo.uid,
                photoURL: newUserInfo.photoURL,
                displayName: newUserInfo.displayName
            });
            return userInfoList.find((userInfo) => userInfo.uid === newUserInfo.uid)
                ? userInfoList : userInfoList.push(newUserInfo);
        } else {
            return userInfoList;
        }
    }

    private _innerLogin(old: List<IUserInfo>, newUserInfoList: List<IUserInfo>): List<IUserInfo> {
        return newUserInfoList;
    }
}