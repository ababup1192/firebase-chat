import {List, Record, Map} from "immutable";

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


