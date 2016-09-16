import {List} from "immutable";
import {IUserInfo, IFirebaseUserInfo, IMessage, IFirebaseMessage} from "../definition/userInfo"

export class UserInfoUtils {

    public static toFirebaseUserInfo(userInfo: IUserInfo): IFirebaseUserInfo {
        return {
            uid: userInfo.uid,
            displayName: userInfo.displayName,
            photoURL: userInfo.photoURL,
            updateTime: userInfo.updateTime.getTime()
        };
    }

    public static toUserInfo(firebaseUserInfo: IFirebaseUserInfo): IUserInfo {
        return {
            uid: firebaseUserInfo.uid,
            displayName: firebaseUserInfo.displayName,
            photoURL: firebaseUserInfo.photoURL,
            updateTime: new Date(firebaseUserInfo.updateTime)
        };
    }

    public static toFirebaseMessage(message: IMessage): IFirebaseMessage {
        return {
            uid: message.uid,
            displayName: message.displayName,
            photoURL: message.photoURL,
            to: message.to.map((u) => this.toFirebaseUserInfo(u)).toJS(),
            contents: message.contents,
            postTime: message.postTime.getTime()
        };
    }

    public static toMessage(firebaseMessage: IFirebaseMessage): IMessage{
        return {
            uid: firebaseMessage.uid,
            displayName: firebaseMessage.displayName,
            photoURL: firebaseMessage.photoURL,
            to: List<IUserInfo>(firebaseMessage.to.map((u) => this.toUserInfo(u))),
            contents: firebaseMessage.contents,
            postTime: new Date(firebaseMessage.postTime)
        };
    }
}