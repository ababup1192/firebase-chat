import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";
import {IMessage, ChatAction} from "../actionCreators/chatAction";
import {UserListAction} from "../actionCreators/userListAction";
import UserList from "./userList.tsx";
import MessageBox from "./messageBox.tsx";
import MessageForm from "./messageForm.tsx";

interface ChatProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
}

interface ChatState {
    userList: List<string>;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    private chatAction: ChatAction;
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;
    private userListAction: UserListAction;
    private userListEvent: Bacon.Property<string, List<string>>;

    constructor(props) {
        super(props);

        this.state = { userList: List<string>() };

        this.chatAction = new ChatAction(new Dispatcher(), this.props.chatRef);
        this.chatEvent = this.chatAction.createProperty();
        this.userListAction = new UserListAction(new Dispatcher());
        this.userListEvent = this.userListAction.createProperty();
    }

    public componentDidMount() {
        this.userListEvent.onValue((userList) => this.setState({ userList: userList }));
    }

    public componentWillUnmount() {
        this.userListAction.end();
    }

    render() {
        return <div className="chat-container">
            <UserList
                uid={this.props.uid}
                usersRef={this.props.usersRef}
                userListAction={this.userListAction}
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