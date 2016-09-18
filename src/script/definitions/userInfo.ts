import {List, Record, Map} from "immutable";

const UserInfoRecord = Record({ uid: "", displayName: "", photoURL: "", updateTime: new Date() });
const UID = "uid";
const DISPLAY_NAME = "displayName";
const PHOTO_URL = "photoURL";
const UPDATE_TIME = "updateTime";

export class UserInfo extends UserInfoRecord {
    public static create(uid: string, displayName: string, photoURL: string, updateTime?: Date): UserInfo {
        return new UserInfo({
            uid: uid, displayName: displayName,
            photoURL: photoURL, updateTime: updateTime === undefined ? new Date() : updateTime
        });
    }

    public uid(): string {
        return this.get(UID) as string;
    }

    public displayName(): string {
        return this.get(DISPLAY_NAME) as string;
    }

    public photoURL(): string {
        return this.get(PHOTO_URL) as string;
    }

    public updateTime(): Date {
        return this.get(UPDATE_TIME) as Date;
    }

    public changeDisplayName(displayName: string): UserInfo {
        return new UserInfo(this.set(DISPLAY_NAME, displayName).toObject());
    }

    public updateLoginStatus(): UserInfo {
        return new UserInfo(this.set(UPDATE_TIME, new Date()).toObject());
    }

    public updateTimeToMs(): number {
        return this.updateTime().getTime();
    }

    public toFirebaseObj(): { [key: string]: any } {
        return this.set(UPDATE_TIME, this.updateTimeToMs()).toObject();
    }

    public static fromFirebaseObj(obj: { [key: string]: any }): UserInfo {
        const userInfoMap = Map(obj).set(UPDATE_TIME, new Date(obj[UPDATE_TIME]));
        return new UserInfo(userInfoMap.toObject());
    }

    public static toUserInfoList(firebaseObjList: { [key: string]: any }): List<UserInfo> {
        return List(Object.keys(firebaseObjList).map((uid) =>
            UserInfo.fromFirebaseObj(firebaseObjList[uid])));
    }
}

