import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";

import {UserInfoUtil} from "../utils/userInfo";
import {IUserInfo, IMessage} from "../definition/definitions";
import MessageBox from "./messageBox.tsx";

interface MessageFormProps {
    uid: string;
    userRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
    toUsers: List<IUserInfo>;
}

export default class MessageForm extends React.Component<MessageFormProps, any> {
    constructor(props) {
        super(props);
    }

    private postMessage(textValue: string) {
        this.props.userRef.child(this.props.uid).once("value", function (snapShot: Firebase.database.DataSnapshot) {
            const user = UserInfoUtil.toUserInfo(snapShot.val());
            this.props.chatRef.push(UserInfoUtil.toFirebaseMessage({
                uid: this.props.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                content: textValue,
                to: this.props.toUsers,
                postTime: new Date()
            }));
        }.bind(this));
    }


    handleKey(e: KeyboardEvent) {
        if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
            e.preventDefault();

            const textValue = (e.target as HTMLSelectElement).value;
            if (textValue !== "") {
                this.postMessage(textValue);
                (e.target as HTMLSelectElement).value = "";
            }
        }
    }

    render() {
        const usersName = this.props.toUsers.isEmpty() ?
            "(ALL)" : this.props.toUsers.map((user) =>
                user.uid === this.props.uid ? "ME" : user.displayName).join(" and ");
        return <textarea
            className="message-form"
            placeholder={`Send => ${usersName}`}
            name="comment"
            onKeyPress={this.handleKey.bind(this) } />;
    }
}