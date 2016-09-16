
import {List} from "immutable";

export interface IHeaderInfo {
    isLogin: boolean;
    selectedItem: string;
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


