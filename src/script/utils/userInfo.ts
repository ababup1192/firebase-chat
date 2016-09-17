import {List} from "immutable";
import {IUserInfo, IFirebaseUserInfo, IMessage, IFirebaseMessage} from "../definitions/definitions";

export class UserInfoUtil {

    public static toUserInfo(firebaseUserInfo: IFirebaseUserInfo): IUserInfo {
        return {
            uid: firebaseUserInfo.uid,
            displayName: firebaseUserInfo.displayName,
            photoURL: firebaseUserInfo.photoURL,
            updateTime: new Date(firebaseUserInfo.updateTime)
        };
    }

    public static toFirebaseUserInfo(userInfo: IUserInfo): IFirebaseUserInfo {
        return {
            uid: userInfo.uid,
            displayName: userInfo.displayName,
            photoURL: userInfo.photoURL,
            updateTime: userInfo.updateTime.getTime()
        };
    }

    public static toUserInfoList(firebaseUserInfoObj: { string: IFirebaseUserInfo }): List<IUserInfo> {
        return List(Object.keys(firebaseUserInfoObj).map((uid) => firebaseUserInfoObj[uid])
            .map((loginStatus: IFirebaseUserInfo) => UserInfoUtil.toUserInfo(loginStatus)));
    }

    public static toMessage(firebaseMessage: IFirebaseMessage): IMessage {
        if (firebaseMessage.to) {
            return {
                uid: firebaseMessage.uid,
                displayName: firebaseMessage.displayName,
                photoURL: firebaseMessage.photoURL,
                to: List<IUserInfo>(firebaseMessage.to.map((u) => this.toUserInfo(u))),
                content: firebaseMessage.content,
                postTime: new Date(firebaseMessage.postTime)
            };
        } else {
            return {
                uid: firebaseMessage.uid,
                displayName: firebaseMessage.displayName,
                photoURL: firebaseMessage.photoURL,
                to: List<IUserInfo>(),
                content: firebaseMessage.content,
                postTime: new Date(firebaseMessage.postTime)
            };
        }
    }

    public static toFirebaseMessage(message: IMessage): IFirebaseMessage {
        return {
            uid: message.uid,
            displayName: message.displayName,
            photoURL: message.photoURL,
            to: message.to.isEmpty() ? [] : message.to.map((u) => this.toFirebaseUserInfo(u)).toJS(),
            content: message.content,
            postTime: message.postTime.getTime()
        };
    }

    public static toMessageList(firebaseMessageObj: { string: IFirebaseMessage }): List<IMessage> {
        return List(Object.keys(firebaseMessageObj).map((uid) => firebaseMessageObj[uid])
            .map((message: IFirebaseMessage) => UserInfoUtil.toMessage(message)));
    }
}