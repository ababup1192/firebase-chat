import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";
import * as Bacon from "baconjs";
import Dispatcher from "../actionCreators/dispatcher";

/* Definition */
import {HeaderInfo} from "../definitions/headerInfo";
import {UserInfo} from "../definitions/userInfo";
import {Message} from "../definitions/message";

/* Action */
import {HeaderAction} from "../actionCreators/headerAction";
import {LoginAction} from "../actionCreators/loginAction";
import {ChatAction} from "../actionCreators/chatAction";

/* Component */
import NoLoggedInHeader from "./noLoggedInHeader.tsx";
import LoggedInHeader from "./loggedInHeader.tsx";
import Chat from "./chat.tsx";
import Login from "./login.tsx";

interface AppState {
    isLogin: boolean;
    selectedItem: string;
    uid: string;
    displayName: string;
    photoURL: string;
}

export default class App extends React.Component<any, AppState> {
    /* Firebase database reference */
    private dbRef: Firebase.database.Reference;
    private usersRef: Firebase.database.Reference;
    private chatRef: Firebase.database.Reference;
    private loginStatusRef: Firebase.database.Reference;

    /* Action and Event */
    private headerAction: HeaderAction;
    private headerEvent: Bacon.Property<HeaderInfo, HeaderInfo>;
    private loginAction: LoginAction;
    private loginEvent: Bacon.Property<UserInfo, UserInfo>;
    private chatAction: ChatAction;

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            selectedItem: "Log In",
            uid: "",
            displayName: "",
            photoURL: ""
        };

        /* Firebase database references */
        this.dbRef = Firebase.database().ref();
        this.usersRef = this.dbRef.child("users");
        this.chatRef = this.dbRef.child("chat");
        this.loginStatusRef = this.dbRef.child("login-status");

        /* Action and Event */
        this.headerAction = new HeaderAction(new Dispatcher());
        this.headerEvent = this.headerAction.createProperty();
        this.loginAction = new LoginAction(new Dispatcher());
        this.loginEvent = this.loginAction.createProperty();
    }

    private updateLoginStatus(user: UserInfo) {
        const currentUser = user.updateLoginStatus();
        if (Firebase.auth().currentUser) {
            this.loginStatusRef.child(currentUser.uid()).set(currentUser.toFirebaseObj());
            return new Bacon.Next<UserInfo>(user);
        } else {
            return new Bacon.End<UserInfo>();
        }

    }

    private updateLoginStatusRepeatedly(user: UserInfo): Bacon.EventStream<{}, UserInfo> {
        return Bacon.fromPoll<{}, UserInfo>(2 * 1000, this.updateLoginStatus.bind(this, user));
    }

    private refreshLoginStatus(): Bacon.Next<any> | Bacon.End<any> {
        const now = new Date().getTime();
        if (Firebase.auth().currentUser) {
            this.loginStatusRef.once("value").then((snapShot: Firebase.database.DataSnapshot) => {
                const firebaseUserInfoList = snapShot.val();
                if (firebaseUserInfoList) {
                    UserInfo.toUserInfoList(firebaseUserInfoList).filter((user: UserInfo) =>
                        ((now - user.updateTime().getTime()) / 1000) > 5
                    ).forEach((user: UserInfo) => {
                        this.loginStatusRef.child(user.uid()).remove();
                        this.chatAction.systemPush(`「${user.displayName()}」が、タイムアウトしました。`);
                    });
                }
            });
            return new Bacon.Next(null);
        } else {
            return new Bacon.End();
        }
    }

    private refreshLoginStatusRepeatedly(): Bacon.EventStream<{}, {}> {
        return Bacon.fromPoll<any, any>(20 * 1000, this.refreshLoginStatus.bind(this));
    }

    private updateUserInfo(user: UserInfo) {
        this.usersRef.child(user.uid()).set(user.toFirebaseObj());
    }

    private componentDidMount() {
        this.loginEvent.onValue((user: UserInfo) => {
            if (Firebase.auth().currentUser) {
                this.setState({
                    isLogin: true,
                    selectedItem: "Main",
                    uid: user.uid(),
                    displayName: user.displayName(),
                    photoURL: user.photoURL()
                });

                this.chatAction = new ChatAction(new Dispatcher(), this.chatRef);
                this.updateLoginStatus(user);
                this.updateLoginStatusRepeatedly(user).onValue(null);
                this.refreshLoginStatus();
                this.refreshLoginStatusRepeatedly().onValue(null);
                this.updateUserInfo(user);
                this.chatAction.systemPush(`「${user.displayName()}」が、ログインしました。`);
            }
        });

        this.headerEvent.onValue((header) => {
            this.setState({
                isLogin: header.isLogin(),
                selectedItem: header.selectedItem(),
                uid: this.state.uid,
                photoURL: this.state.photoURL,
                displayName: this.state.displayName
            });
        });
    }

    public componentWillUnmount() {
        this.loginAction.end();
    }

    private selectContents(): JSX.Element {
        switch (this.state.selectedItem) {
            case "Main":
                return <Chat
                    uid={this.state.uid}
                    usersRef={this.usersRef}
                    loginStatusRef={this.loginStatusRef}
                    chatRef={this.chatRef}
                    chatAction={this.chatAction}
                    />;
            case "Settings":
                return <p>Settings</p>;
        }
    }

    private showHeaderWithContents(): JSX.Element {
        return this.state.isLogin ?
            <div>
                <LoggedInHeader
                    displayName={ this.state.displayName }
                    photoURL={ this.state.photoURL }
                    loginStatusRef={ this.loginStatusRef }
                    headerAction={ this.headerAction }
                    chatAction={ this.chatAction }
                    />
                { this.selectContents() }
            </div>
            :
            <div>
                <NoLoggedInHeader />
                <Login
                    usersRef={this.usersRef}
                    headerAction={this.headerAction}
                    loginAction={this.loginAction}
                    />
            </div>;
    }

    render() {
        return (
            <div className="app">
                {this.showHeaderWithContents() }
            </div>
        );
    }
}