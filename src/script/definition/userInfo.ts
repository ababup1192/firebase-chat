
import {List} from "immutable";

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

export interface IMessage {
    uid: string;
    displayName: string;
    photoURL: string;
    to: List<IUserInfo>;
    contents: string;
    postTime: Date;
}

export interface IFirebaseMessage {
    uid: string;
    displayName: string;
    photoURL: string;
    to: List<IFirebaseUserInfo>;
    contents: string;
    postTime: number;
}


