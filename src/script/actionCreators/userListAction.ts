import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

const PUSH = "PUSH";
const DELELTE = "DELETE";
const CLEAR = "CLEAR";

export interface IUidWithName {
    uid: string;
    displayName: string;
}

export class UserListAction {
    private d: Dispatcher;
    private usersRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, usersRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.usersRef = usersRef;
    }

    public push(uidWithName: IUidWithName) {
        this.d.push(PUSH, uidWithName);
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

    public createProperty(): Bacon.Property<string, List<IUidWithName>> {
        return Bacon.update<string, IUidWithName, string, any, List<IUidWithName>>(List<IUidWithName>(),
            [this.d.stream(PUSH)], this._push.bind(this),
            [this.d.stream(DELELTE)], this._delete.bind(this),
            [this.d.stream(CLEAR)], this._clear.bind(this)
        );
    }

    private _push(userList: List<IUidWithName>, uidWithName: IUidWithName): List<IUidWithName> {
        return userList.push(uidWithName);
    }

    private _delete(userList: List<IUidWithName>, uid: string): List<IUidWithName> {
        return userList.filterNot((user) => user.uid === uid).toList();
    }

    private _clear(userList: List<IUidWithName>, ignore: any): List<IUidWithName> {
        return List<IUidWithName>();
    }
}