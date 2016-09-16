import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

import {IHeaderInfo} from "../definition/definitions";

const CHANGE_ITEM = "CHANGE_ITEM";
const LOGOUT = "LOGOUT";

export class HeaderAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeItem(item: IHeaderInfo) {
        this.d.push(CHANGE_ITEM, item);
    }

    public logout(): void {
        this.d.push(LOGOUT, null);
    }

    public createProperty(): Bacon.Property<IHeaderInfo, IHeaderInfo> {
        return Bacon.update<IHeaderInfo, IHeaderInfo, IHeaderInfo, IHeaderInfo>({ isLogin: false, selectedItem: "Log In" } ,
            [this.d.stream(CHANGE_ITEM)], this._changeItem.bind(this),
            [this.d.stream(LOGOUT)], this._logout.bind(this)
        );
    }

    private _changeItem(old: IHeaderInfo, newItem: IHeaderInfo): IHeaderInfo {
        return newItem;
    }

    private _logout(old: IHeaderInfo, ignore: any): IHeaderInfo {
        return { isLogin: false, selectedItem: "Log In" };
    }
}