import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";
import {IMessage, ChatAction} from "../actionCreators/chatAction";
import {IUserInfo, LoginAction} from "../actionCreators/loginAction";
import UserList from "./userList.tsx";
import MessageBox from "./messageBox.tsx";
import MessageForm from "./messageForm.tsx";

interface ChatProps {
    uid: string;
    displayName: string;
    usersRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
    loginAction: LoginAction;
    loginEvent: Bacon.Property<IUserInfo, List<IUserInfo>>;
}

export default class Chat extends React.Component<ChatProps, any> {
    private chatAction: ChatAction;
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;

    constructor(props) {
        super(props);

        this.chatAction = new ChatAction(new Dispatcher(), this.props.chatRef);
        this.chatEvent = this.chatAction.createProperty();
    }

    handleKey(e: KeyboardEvent) {
        if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
            e.preventDefault();

            const textValue = (e.target as HTMLSelectElement).value;
            if (textValue !== "") {
                this.chatAction.post({
                    uid: this.props.uid,
                    name: this.props.displayName,
                    content: textValue
                });
            }
            (e.target as HTMLSelectElement).value = "";
        }
    }

    render() {
        return <div className="chat-container">
            <UserList
                uid={this.props.uid}
                usersRef={this.props.usersRef}
                loginAction={this.props.loginAction}
                loginEvent={this.props.loginEvent}
            />
            <div className="message-area">
                <MessageBox
                    uid={this.props.uid}
                    chatRef={this.props.chatRef}
                    chatAction={this.chatAction}
                    chatEvent={this.chatEvent}
                    />
                <MessageForm
                    uid={this.props.uid}
                    displayName={this.props.displayName}
                    chatAction={this.chatAction}
                    />
            </div>
        </div>;
    }
}