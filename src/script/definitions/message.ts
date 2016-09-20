import {List, Record, Map, Iterable, Range} from "immutable";
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
            Message.fromFirebaseObj(firebaseObjList[uid]))).
            sortBy((message) => message.postTime().getTime()).toList();
    }

    public static toContinuousMessageList(messages: List<Message>): List<List<Message>> {
        let memo = Map<number, string>();
        return messages.
            groupBy((mes: Message, key: number, iter: Iterable<number, Message>) => {
                function isGroup(curMes: Message, key: number) {
                    const targetMes = iter.get(key);
                    const diffMinutes = targetMes === undefined ?
                        Number.MAX_VALUE :
                        Math.abs(curMes.postTime().getTime() - targetMes.postTime().getTime()) / (1000 * 60);
                    return (key >= 0 && key <= iter.keySeq().last() &&
                        targetMes.uid() === curMes.uid() && diffMinutes < 10.0);
                }
                function getGroupKeys(curMes: Message, key: number): string {
                    if (isGroup(curMes, key)) {
                        return memo.get(key);
                    } else {
                        return "";
                    }
                }
                function collectGroupKeys(curKey: number, keys = "") {
                    memo = memo.set(curKey, String(curKey));
                    Range(curKey).takeWhile((key) => {
                        const curMes = iter.get(key);
                        const nextKey = key + 1;
                        return isGroup(curMes, nextKey);
                    }).forEach((key) => {
                        memo = memo.set(key, String(curKey));
                    });
                }
                const preKeys = getGroupKeys(mes, key - 1);
                if (preKeys !== undefined && preKeys !== "") {
                    memo = memo.set(key, preKeys);
                    return preKeys;
                } else {
                    collectGroupKeys(key);
                    return memo.get(key);
                }
            }).sortBy((value) => value.first().postTime().getTime()).map((value) => value.toList()).toList();
    }

    public static toContinuousMessageListFromFirebaseObj(firebaseObjList: { [key: string]: any }): List<List<Message>> {
        return this.toContinuousMessageList(this.toMessageList(firebaseObjList));
    }
}


