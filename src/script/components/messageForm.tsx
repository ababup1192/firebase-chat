import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";
import {IMessage, ChatAction} from "../actionCreators/chatAction";
import {IUserInfo, LoginAction} from "../actionCreators/loginAction";
import MessageBox from "./messageBox.tsx";

interface MessageFormProps {
    uid: string;
    displayName: string;
    chatAction: ChatAction;
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
            if (textValue !== "") {
                this.props.chatAction.post({
                    uid: this.props.uid,
                    name: this.props.displayName,
                    content: textValue
                });
            }
            (e.target as HTMLSelectElement).value = "";
        }
    }

    render() {
        return <textarea
            className="message-form"
            placeholder="Write your comment here"
            name="comment"
            onKeyPress={this.handleKey.bind(this) } />;
    }
}