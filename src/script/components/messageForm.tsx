import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";

import {UserInfoUtil} from "../utils/userInfo";
import {IUserInfo, IMessage} from "../definition/definitions";
import {ChatAction} from "../actionCreators/chatAction";
import MessageBox from "./messageBox.tsx";

interface MessageFormProps {
    uid: string;
    userRef: Firebase.database.Reference;
    chatAction: ChatAction;
    toUsers: List<IUserInfo>;
}

export default class MessageForm extends React.Component<MessageFormProps, any> {
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;

    constructor(props) {
        super(props);
    }

    handleKey(e: KeyboardEvent) {
        if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
            e.preventDefault();

            const textValue = (e.target as HTMLSelectElement).value;
            this.props.userRef.child(this.props.uid).once("value", (snapShot: Firebase.database.DataSnapshot) => {
                const user = UserInfoUtil.toUserInfo(snapShot.val());
                if (textValue !== "") {
                    this.props.chatAction.post({
                        uid: this.props.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        content: textValue,
                        to: this.props.toUsers,
                        postTime: new Date()
                    });
                }
            });
            (e.target as HTMLSelectElement).value = "";
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