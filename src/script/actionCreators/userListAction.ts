import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

import {IUserInfo} from "../definitions/definitions";

const PUSH = "PUSH";
const DELELTE = "DELETE";
const CLEAR = "CLEAR";

export class UserListAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public push(userInfo: IUserInfo) {
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

    public createProperty(): Bacon.Property<string, List<IUserInfo>> {
        return Bacon.update<string, IUserInfo, string, any, List<IUserInfo>>(List<IUserInfo>(),
            [this.d.stream(PUSH)], this._push.bind(this),
            [this.d.stream(DELELTE)], this._delete.bind(this),
            [this.d.stream(CLEAR)], this._clear.bind(this)
        );
    }

    private _push(userList: List<IUserInfo>, uidWithName: IUserInfo): List<IUserInfo> {
        return userList.push(uidWithName);
    }

    private _delete(userList: List<IUserInfo>, uid: string): List<IUserInfo> {
        return userList.filterNot((user) => user.uid === uid).toList();
    }

    private _clear(userList: List<IUserInfo>, ignore: any): List<IUserInfo> {
        return List<IUserInfo>();
    }
}