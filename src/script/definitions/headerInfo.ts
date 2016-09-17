import {List, Record} from "immutable";

const HeaderInfoRecord = Record({ isLogin: false, selectedItem: "" });
const IS_LOGIN = "isLogin";
const SELECTED_ITEM = "selectedItem";

export class HeaderInfo extends HeaderInfoRecord {
    public static create(isLogin: boolean, selectedItem: string): HeaderInfo {
        return new HeaderInfo({ isLogin: isLogin, selectedItem: selectedItem });
    }

    public isLogin(): boolean {
        return this.get(IS_LOGIN) as boolean;
    }

    public selectedItem(): string {
        return this.get(SELECTED_ITEM) as string;
    }

    public static login(): HeaderInfo {
        return HeaderInfo.create(true, "Main");
    }

    public changeItem(item: string) {
        return new HeaderInfo(this.set(SELECTED_ITEM, item).toObject());
    }

    public static logout(): HeaderInfo {
        return HeaderInfo.create(false, "Log In");
    }
}

