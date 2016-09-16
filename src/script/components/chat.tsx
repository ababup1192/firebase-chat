import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import Dispatcher from "../actionCreators/dispatcher";

/* Definition */
import {IUserInfo, IMessage} from "../definition/definitions";

/* Action */
import {ChatAction} from "../actionCreators/chatAction";
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
    // loginUserEvent: Bacon.Property<IUserInfo, IUserInfo>;
}

interface ChatState {
    usersList: List<IUserInfo>;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    private chatAction: ChatAction;
    private chatEvent: Bacon.Property<IMessage, List<IMessage>>;
    private userListAction: UserListAction;
    private userListEvent: Bacon.Property<string, List<IUserInfo>>;

    constructor(props) {
        super(props);

        this.state = { usersList: List<IUserInfo>() };

        this.chatAction = new ChatAction(new Dispatcher(), this.props.chatRef);
        this.chatEvent = this.chatAction.createProperty();
        this.userListAction = new UserListAction(new Dispatcher(), this.props.usersRef);
        this.userListEvent = this.userListAction.createProperty();
    }

    public componentDidMount() {
        /*this.props.loginUserEvent.onValue(() => {

        });*/
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
                    chatAction={this.chatAction}
                    chatEvent={this.chatEvent}
                    />
                <MessageForm
                    uid={this.props.uid}
                    userRef={this.props.usersRef}
                    chatAction={this.chatAction}
                    toUsers={this.state.usersList}
                    />
            </div>
        </div>;
    }
}