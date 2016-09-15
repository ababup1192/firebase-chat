import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../actionCreators/dispatcher";
import {LoginAction} from "../actionCreators/LoginAction";
import {TwitterLoginAction, IUserInfo} from "../actionCreators/twitterLoginAction";
import {ChatAction, IMessage} from "../actionCreators/chatAction";
import {HeaderAction, IItemInfo} from "../actionCreators/headerAction";
import NoLoggedInHeader from "./noLoggedInHeader.tsx";
import LoggedInHeader from "./loggedInHeader.tsx";
import Chat from "./chat.tsx";
import Login from "./login.tsx";

interface AppState {
    isLogin: boolean;
    selectedItem: string;
    uid: string;
    photoURL: string;
    displayName: string;
}

export default class App extends React.Component<any, AppState> {
    private loginAction: LoginAction;
    private loginEvent: Bacon.Property<IUserInfo, IUserInfo>;
    private headerAction: HeaderAction;
    private headerEvent: Bacon.Property<IItemInfo, IItemInfo>;
    private dbRef: Firebase.database.Reference;
    private usersRef: Firebase.database.Reference;

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            selectedItem: "Log in",
            uid: "",
            displayName: "",
            photoURL: ""
        };

        this.dbRef = Firebase.database().ref();
        this.usersRef = this.dbRef.child("users");
        this.loginAction = new LoginAction(new Dispatcher());
        this.loginEvent = this.loginAction.createProperty();
        this.headerAction = new HeaderAction(new Dispatcher());
        this.headerEvent = this.headerAction.createProperty();
    }

    private componentDidMount() {
        this.loginEvent.onValue((user) => {
            if (Firebase.auth().currentUser) {
                this.usersRef.child(user.uid).set({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });
                this.setState({
                    isLogin: true,
                    selectedItem: "Main",
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });
            }
        });

        this.headerEvent.onValue((item) => {
            const user = Firebase.auth().currentUser;
            if (user && this.state.isLogin) {
                this.setState({
                    isLogin: item.isLogin,
                    selectedItem: item.selectedItem,
                    uid: user.uid,
                    displayName: this.state.displayName,
                    photoURL: user.photoURL
                });
            } else {
                this.setState({
                    isLogin: item.isLogin,
                    selectedItem: item.selectedItem,
                    uid: "",
                    displayName: "",
                    photoURL: ""
                });
            }
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
                    // twitterLoginAction={this.twitterLoginAction}
                    // twitterLoginEvent={this.twitterLoginEvent}
                    chatRef={this.dbRef.child("chat") }
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