import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";
import * as Bacon from "baconjs";
import Dispatcher from "../actionCreators/dispatcher";

/* Definition */
import {IHeaderInfo, IUserInfo} from "../definition/definitions";

/* Utils */
import {UserInfoUtil} from "../utils/userInfo";

/* Action */
import {HeaderAction} from "../actionCreators/headerAction";
import {LoginAction} from "../actionCreators/LoginAction";
import {LoginStatusAction} from "../actionCreators/LoginStatusAction";

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
    private headerEvent: Bacon.Property<IHeaderInfo, IHeaderInfo>;
    private loginAction: LoginAction;
    private loginEvent: Bacon.Property<IUserInfo, IUserInfo>;
    private loginStatusAction: LoginStatusAction;
    private loginStatusEvent: Bacon.Property<IUserInfo, IUserInfo>;

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            selectedItem: "Log in",
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
        this.loginStatusAction = new LoginStatusAction(new Dispatcher(), this.loginStatusRef);
        this.loginStatusEvent = this.loginStatusAction.createProperty();
    }

    private updateLoginStatus(user: IUserInfo) {
        if (Firebase.auth().currentUser) {
            this.loginStatusRef.child(user.uid).set(UserInfoUtil.toFirebaseUserInfo({
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
                updateTime: new Date()
            }));
            return new Bacon.Next<IUserInfo>(user);
        } else {
            return new Bacon.End<IUserInfo>();
        }

    }

    private updateLoginStatusRepeatedly(user: IUserInfo): Bacon.EventStream<{}, IUserInfo> {
        return Bacon.fromPoll<{}, IUserInfo>(2 * 1000, this.updateLoginStatus.bind(this, user));
    }

    private refreshLoginStatus(): Bacon.Next<any> | Bacon.End<any> {
        if (Firebase.auth().currentUser) {
            this.loginStatusRef.once("value").then((snapShot: Firebase.database.DataSnapshot) => {
                const now = new Date().getTime();
                UserInfoUtil.toUserInfoList(snapShot.val()).filter((user: IUserInfo) =>
                    ((now - user.updateTime.getTime()) / 1000) > 7
                ).forEach((user: IUserInfo) =>
                    this.loginStatusRef.child(user.uid).remove());
            });
            return new Bacon.Next(null);
        } else {
            return new Bacon.End();
        }
    }

    private refreshLoginStatusRepeatedly(): Bacon.EventStream<{}, {}> {
        return Bacon.fromPoll<any, any>(20 * 1000, this.refreshLoginStatus.bind(this));
    }

    private updateUserInfo(user: IUserInfo) {
        this.usersRef.child(user.uid).set(UserInfoUtil.toFirebaseUserInfo(user));
    }

    private componentDidMount() {
        this.loginEvent.onValue((user: IUserInfo) => {
            if (Firebase.auth().currentUser) {
                this.setState({
                    isLogin: true,
                    selectedItem: "Main",
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });

                this.updateLoginStatus(user);
                this.updateLoginStatusRepeatedly(user).onValue(null);
                this.refreshLoginStatus();
                this.refreshLoginStatusRepeatedly().onValue(null);
                this.updateUserInfo(user);
            }
        });

        this.headerEvent.onValue((item) => {
            // const user = Firebase.auth().currentUser;
            this.setState({
                isLogin: item.isLogin,
                selectedItem: item.selectedItem,
                uid: this.state.uid, // user === null ? "" : user.uid,
                photoURL: this.state.photoURL, // user.photoURL === null ? "" : user.photoURL,
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
                    />;
            case "Settings":
                return <p>Settings</p>;
        }
    }

    render() {
        return (
            <div className="app">
                {
                    this.state.isLogin ?
                        <div>
                            <LoggedInHeader
                                usersRef={ this.usersRef }
                                photoURL={ this.state.photoURL }
                                headerAction={ this.headerAction }
                                />
                            { this.selectContents() }
                        </div>
                        :
                        <div>
                            <NoLoggedInHeader />
                            <Login
                                usersRef={this.usersRef}
                                loginAction={this.loginAction}
                                />
                        </div>
                }
            </div>
        );
    }
}