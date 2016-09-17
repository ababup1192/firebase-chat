import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";

/* Definition */
import {UserInfo} from "../definitions/userInfo";
import {Message} from "../definitions/message";

/* Action */
import {UserListAction} from "../actionCreators/userListAction";

/* Component */
import UserList from "./userList.tsx";
import MessageBox from "./messageBox.tsx";
import MessageForm from "./messageForm.tsx";

interface ChatProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
    loginStatusRef: Firebase.database.Reference;
}

interface ChatState {
    usersList: List<UserInfo>;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    private userListAction: UserListAction;
    private userListEvent: Bacon.Property<string, List<UserInfo>>;

    constructor(props) {
        super(props);

        this.state = { usersList: List<UserInfo>() };

        this.userListAction = new UserListAction(new Dispatcher());
        this.userListEvent = this.userListAction.createProperty();
    }

    public componentDidMount() {
        this.userListEvent.onValue((users) => this.setState({ usersList: users }));
    }

    public componentWillUnmount() {
        this.userListAction.end();
    }

    render() {
        return <div className="chat-container">
            <UserList
                uid={this.props.uid}
                usersRef={this.props.usersRef}
                loginStatusRef={this.props.loginStatusRef}
                userListAction={this.userListAction}
                />
            <div className="message-area">
                <MessageBox
                    uid={this.props.uid}
                    chatRef={this.props.chatRef}
                    />
                <MessageForm
                    uid={this.props.uid}
                    userRef={this.props.usersRef}
                    chatRef={this.props.chatRef}
                    toUsers={this.state.usersList}
                    />
            </div>
        </div>;
    }
}