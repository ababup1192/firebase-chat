import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

import {HeaderInfo} from "../definitions/headerInfo";

const LOGIN = "LOGIN";
const CHANGE_ITEM = "CHANGE_ITEM";
const LOGOUT = "LOGOUT";

export class HeaderAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public login() {
        this.d.push(LOGIN, null);
    }

    public changeItem(item: string) {
        this.d.push(CHANGE_ITEM, item);
    }

    public logout() {
        this.d.push(LOGOUT, null);
    }

    public end() {
        this.d.stream(LOGIN).end();
        this.d.stream(CHANGE_ITEM).end();
        this.d.stream(LOGOUT).end();
    }

    public createProperty(): Bacon.Property<HeaderInfo, HeaderInfo> {
        return Bacon.update<HeaderInfo, any, string, HeaderInfo, HeaderInfo>(HeaderInfo.create(false, "Log In"),
            [this.d.stream(LOGIN)], this._login.bind(this),
            [this.d.stream(CHANGE_ITEM)], this._changeItem.bind(this),
            [this.d.stream(LOGOUT)], this._logout.bind(this)
            );
    }

    private _login(old: HeaderInfo, ignore: string): HeaderInfo {
        return HeaderInfo.login();
    }

    private _changeItem(headerInfo: HeaderInfo, item: string): HeaderInfo {
        return headerInfo.changeItem(item);
    }

    private _logout(old: HeaderInfo, ignore: any): HeaderInfo {
        return HeaderInfo.logout();
    }
}