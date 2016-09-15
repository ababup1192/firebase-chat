import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";
import {IMessage, ChatAction} from "../actionCreators/chatAction";
import {IUidWithName} from "../actionCreators/userListAction";
import MessageBox from "./messageBox.tsx";

interface MessageFormProps {
    uid: string;
    userRef: Firebase.database.Reference;
    chatAction: ChatAction;
    toUsers: List<IUidWithName>;
}

export default class MessageForm extends React.Component<MessageFormProps, any> {
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;

    constructor(props) {
        super(props);
    }

    handleKey(e: KeyboardEvent) {
        if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
            e.preventDefault();

            this.props.userRef.child(this.props.uid).once("value", (snapShot) => {
                const user = snapShot.val();
                const textValue = (e.target as HTMLSelectElement).value;
                if (textValue !== "") {
                    this.props.chatAction.post({
                        uid: this.props.uid,
                        name: user.displayName,
                        content: textValue
                    });
                }
                (e.target as HTMLSelectElement).value = "";
            });
        }
    }

    render() {
        const usersName = this.props.toUsers.isEmpty() ?
            "All" : this.props.toUsers.map((user) => user.displayName).join(" and ");
        return <textarea
            className="message-form"
            placeholder={`Send -> ${usersName}`}
            name="comment"
            onKeyPress={this.handleKey.bind(this) } />;
    }
}