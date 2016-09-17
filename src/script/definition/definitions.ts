
import {List, Record} from "immutable";

const HeaderInfoRecord = Record({ isLogin: false, selectedItem: "" });

export class HeaderInfo extends HeaderInfoRecord {
    private IS_LOGIN = "isLogin";
    private SELECTED_ITEM = "selectedItem";

    public static create(isLogin: boolean, selectedItem: string): HeaderInfo {
        return new HeaderInfo({ isLogin: isLogin, selectedItem: selectedItem });
    }

    public isLogin(): boolean {
        return this.get(this.IS_LOGIN) as boolean;
    }

    public selectedItem(): string {
        return this.get(this.SELECTED_ITEM) as string;
    }

    public static login(): HeaderInfo {
        return HeaderInfo.create(true, "Main");
    }

    public changeItem(item: string) {
        return new HeaderInfo(this.set(this.SELECTED_ITEM, item).toObject());
    }

    public static logout(): HeaderInfo {
        return HeaderInfo.create(false, "Log in");
    }
}

/* User Info */
export interface IUserInfo {
    uid: string;
    displayName: string;
    photoURL: string;
    updateTime: Date;
}

export interface IFirebaseUserInfo {
    uid: string;
    displayName: string;
    photoURL: string;
    updateTime: number;
}

/* Chat Message */
export interface IMessage {
    uid: string;
    displayName: string;
    photoURL: string;
    to: List<IUserInfo>;
    content: string;
    postTime: Date;
}

export interface IFirebaseMessage {
    uid: string;
    displayName: string;
    photoURL: string;
    to: IFirebaseUserInfo[];
    content: string;
    postTime: number;
}


