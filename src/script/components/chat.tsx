import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";
import {IMessage, ChatAction} from "../actionCreators/chatAction";
import {IUserInfo, TwitterLoginAction} from "../actionCreators/twitterLoginAction";
import UserList from "./userList.tsx";
import MessageBox from "./messageBox.tsx";
import MessageForm from "./messageForm.tsx";

interface ChatProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
}

export default class Chat extends React.Component<ChatProps, any> {
    private chatAction: ChatAction;
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;

    constructor(props) {
        super(props);

        this.chatAction = new ChatAction(new Dispatcher(), this.props.chatRef);
        this.chatEvent = this.chatAction.createProperty();
    }

    render() {
        return <div className="chat-container">
            <UserList
                uid={this.props.uid}
                usersRef={this.props.usersRef}
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
                    userRef={this.props.usersRef}
                    chatAction={this.chatAction}
                    />
            </div>
        </div>;
    }
}