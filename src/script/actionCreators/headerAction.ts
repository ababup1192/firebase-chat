import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";

const CHANGE_ITEM = "CHANGE_ITEM";
const LOGOUT = "LOGOUT";

export interface IItemInfo {
    isLogin: boolean;
    selectedItem: string;
}

export class HeaderAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public changeItem(item: IItemInfo) {
        this.d.push(CHANGE_ITEM, item);
    }

    public logout(): void {
        this.d.push(LOGOUT, null);
    }

    public createProperty(): Bacon.Property<IItemInfo, IItemInfo> {
        return Bacon.update<IItemInfo, IItemInfo, IItemInfo, IItemInfo>({ isLogin: false, selectedItem: "Log In" } ,
            [this.d.stream(CHANGE_ITEM)], this._changeItem.bind(this),
            [this.d.stream(LOGOUT)], this._logout.bind(this)
        );
    }

    private _changeItem(old: IItemInfo, newItem: IItemInfo): IItemInfo {
        return newItem;
    }

    private _logout(old: IItemInfo, ignore: any): IItemInfo {
        return { isLogin: false, selectedItem: "Log In" };
    }
}