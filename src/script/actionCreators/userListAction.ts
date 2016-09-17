import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

import {UserInfo} from "../definitions/userInfo";

const PUSH = "PUSH";
const DELELTE = "DELETE";
const CLEAR = "CLEAR";

export class UserListAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public push(userInfo: UserInfo) {
        this.d.push(PUSH, userInfo);
    }

    public delete(uid: string) {
        this.d.push(DELELTE, uid);
    }

    public clear() {
        this.d.push(CLEAR, null);
    }

    public end() {
        this.d.stream(PUSH).end();
        this.d.stream(DELELTE).end();
        this.d.stream(CLEAR).end();
    }

    public createProperty(): Bacon.Property<string, List<UserInfo>> {
        return Bacon.update<string, UserInfo, string, any, List<UserInfo>>(List<UserInfo>(),
            [this.d.stream(PUSH)], this._push.bind(this),
            [this.d.stream(DELELTE)], this._delete.bind(this),
            [this.d.stream(CLEAR)], this._clear.bind(this)
        );
    }

    private _push(userList: List<UserInfo>, uidWithName: UserInfo): List<UserInfo> {
        return userList.push(uidWithName);
    }

    private _delete(userList: List<UserInfo>, uid: string): List<UserInfo> {
        return userList.filterNot((user) => user.uid() === uid).toList();
    }

    private _clear(userList: List<UserInfo>, ignore: any): List<UserInfo> {
        return List<UserInfo>();
    }
}