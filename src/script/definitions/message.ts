
import {List, Record, Map} from "immutable";
import {UserInfo} from "./userInfo";

const MessageRecord = Record({
    uid: "", displayName: "", photoURL: "",
    to: List<UserInfo>(), content: "", postTime: new Date()
});
const UID = "uid";
const DISPLAY_NAME = "displayName";
const PHOTO_URL = "photoURL";
const TO = "to";
const CONTENT = "content";
const POST_TIME = "postTime";

export class Message extends MessageRecord {
    public static create(uid: string, displayName: string, photoURL: string,
        to: List<UserInfo>, content: string, postTime?: Date): Message {
        return new Message({
            uid: uid, displayName: displayName, photoURL: photoURL, to: to,
            content: content, postTime: postTime === undefined ? new Date() : postTime
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

    public to(): List<UserInfo> {
        return this.get(TO) as List<UserInfo>;
    }

    public content(): string {
        return this.get(CONTENT) as string;
    }

    public postTime(): Date {
        return this.get(POST_TIME) as Date;
    }

    public isAllMessage(): boolean {
        return this.to().isEmpty();
    }

    public isShow(myUid): boolean {
        return this.isAllMessage() || this.uid() === myUid || this.to().some((user) => user.uid() === myUid);
    }

    public showPostTimeAMPM(): string {
        const hoursMS: number = this.postTime().getHours();
        const minutesMS: number = this.postTime().getMinutes();
        const ampm = hoursMS >= 12 ? "PM" : "AM";
        const hoursTmp: number = hoursMS % 12;
        const hours = hoursTmp ? hoursTmp : 12;
        const minutes = minutesMS < 10 ? "0" + minutesMS : minutesMS;
        return `${hours}:${minutes} ${ampm}`;
    }

    public toUsersString(myUid: string): string {
        return this.isAllMessage() ? "(ALL)" :
            this.to().map(user => user.uid() === myUid ? "(ME)" : user.displayName()).join(" and ");
    }

    public className(myUid): string {
        return this.uid() === myUid ? "message-me" : "message-other";
    }

    public postTimeToMs(): number {
        return this.postTime().getTime();
    }

    public toFirebaseObj(): { [key: string]: any } {
        return this.set(TO, this.to().map((userInfo) => userInfo.toFirebaseObj()).toJS())
            .set(POST_TIME, this.postTimeToMs()).toObject();
    }

    public static fromFirebaseObj(obj: { [key: string]: any }): Message {
        const messageMap = Map(obj).set(TO, obj[TO] === undefined ? List() :
            UserInfo.toUserInfoList(obj[TO]))
            .set(POST_TIME, new Date(obj[POST_TIME]));
        return new Message(messageMap.toObject());
    }

    public static toMessageList(firebaseObjList: { [key: string]: any }): List<Message> {
        return List(Object.keys(firebaseObjList).map((uid) =>
            Message.fromFirebaseObj(firebaseObjList[uid])));
    }
}


