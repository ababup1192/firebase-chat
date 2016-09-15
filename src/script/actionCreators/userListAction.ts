import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

const PUSH = "PUSH";
const DELELTE = "DELETE";
const CLEAR = "CLEAR";

export class UserListAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public push(uid: string) {
        this.d.push(PUSH, uid);
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

    public createProperty(): Bacon.Property<string, List<string>> {
        return Bacon.update<string, string, string, any, List<string>>(List<string>(),
            [this.d.stream(PUSH)], this._push.bind(this),
            [this.d.stream(DELELTE)], this._delete.bind(this),
            [this.d.stream(CLEAR)], this._clear.bind(this)
        );
    }

    private _push(userList: List<string>, uid: string): List<string> {
        return userList.push(uid);
    }

    private _delete(userList: List<string>, uid: string): List<string> {
        return userList.filterNot((luid) => luid === uid).toList();
    }

    private _clear(userList: List<string>, ignore: any): List<string> {
        return List<string>();
    }
}