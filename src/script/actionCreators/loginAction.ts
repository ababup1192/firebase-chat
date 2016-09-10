import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";

const LOGIN = "LOGIN";

export interface UserInfo {
    uid: string;
    photoURL: string;
    displayName: string;
}

export class LoginAction {
    private d: Dispatcher;
    private usersRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, userRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.usersRef = userRef;
    }

    public login(userInfo: UserInfo): void {
        this.d.push(LOGIN, userInfo);
    }

    public createProperty(): Bacon.Property<UserInfo, UserInfo> {
        return Bacon.update<UserInfo, UserInfo, UserInfo>({ uid: "", photoURL: "", displayName: "" },
            [this.d.stream(LOGIN)], this._login.bind(this)
        );
    }

    private _login(old: UserInfo, newUserInfo: UserInfo): UserInfo {
        if (newUserInfo.uid !== "") {
            this.usersRef.child(newUserInfo.uid).set({
                uid: newUserInfo.uid,
                photoURL: newUserInfo.photoURL,
                displayName: newUserInfo.displayName
            });
        }

        return newUserInfo;
    }

}