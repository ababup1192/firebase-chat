import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";

import {UserInfo} from "../definitions/userInfo";
import {Message} from "../definitions/message";
import MessageBox from "./messageBox.tsx";

interface MessageFormProps {
    uid: string;
    userRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
    toUsers: List<UserInfo>;
}

export default class MessageForm extends React.Component<MessageFormProps, any> {
    constructor(props) {
        super(props);
    }

    private postMessage(textValue: string) {
        this.props.userRef.child(this.props.uid).once("value",
            function (snapShot: Firebase.database.DataSnapshot) {
                const user = UserInfo.fromFirebaseObj(snapShot.val());
                this.props.chatRef.push(Message.create(
                    this.props.uid,
                    user.displayName(),
                    user.photoURL(),
                    this.props.toUsers,
                    textValue
                ).toFirebaseObj());
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
                user.uid() === this.props.uid ? "(ME)" : user.displayName()).join(" and ");
        return <textarea
            className="message-form"
            placeholder={`Send => ${usersName}`}
            name="comment"
            onKeyPress={this.handleKey.bind(this) } />;
    }
}