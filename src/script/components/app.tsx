import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../actionCreators/dispatcher";
import {LoginAction, IUserInfo} from "../actionCreators/loginAction";
import {ChatAction, IMessage} from "../actionCreators/chatAction";
import Chat from "./chat.tsx";
import Login from "./login.tsx";

interface AppState {
    isLogin: boolean;
    selectedMenuItem: string;
    uid: string;
    photoURL: string;
    displayName: string;
}

export default class App extends React.Component<any, AppState> {
    private loginAction: LoginAction;
    private loginEvent: Bacon.Property<IUserInfo, List<IUserInfo>>;
    private dbRef: Firebase.database.Reference;
    private usersRef: Firebase.database.Reference;

    constructor(props) {
        super(props);

        this.state = {
            isLogin: false,
            selectedMenuItem: "Log in",
            uid: "",
            displayName: "",
            photoURL: ""
        };

        this.dbRef = Firebase.database().ref();
        this.usersRef = this.dbRef.child("users");
        this.loginAction = new LoginAction(new Dispatcher(), this.usersRef);
        this.loginEvent = this.loginAction.createProperty();

        this.loginEvent.onValue(() => {
            const user = Firebase.auth().currentUser;
            if (user && this.state.isLogin === false) {
                this.setState({
                    isLogin: true,
                    selectedMenuItem: "Main",
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });
            }
        });
    }

    public componentDidUpdate(): void {

        if (this.state.isLogin) {
        }
    }

    private handleClick(isLogin, selectedMenuItem) {
        this.setState({
            isLogin: isLogin,
            selectedMenuItem: selectedMenuItem,
            uid: this.state.uid,
            displayName: this.state.displayName,
            photoURL: this.state.photoURL
        });
    }

    private handleClickMain() {
        this.handleClick(true, "Main");
    }

    private handleClickSettings() {
        this.handleClick(true, "Settings");
    }

    private handleClickLogout() {
        if (confirm("ログアウトして、よろしいですか？")) {
            this.usersRef.child(Firebase.auth().currentUser.uid).remove();
            Firebase.auth().signOut().then(() => { }
                , function (error) {
                    console.error(error);
                });
            this.handleClick(false, "Log in");
        }
    }

    private selectedMenuItem(itemName): string {
        return itemName === this.state.selectedMenuItem ? "is-site-header-item-selected" : "";
    }

    private showLeftMenu(): JSX.Element {
        const MAIN_CLASS = `siteHeader__item siteHeaderButton ${this.selectedMenuItem("Main")}`;
        if (this.state.isLogin) {
            return <div className="siteHeader__section">
                <div
                    className={MAIN_CLASS}
                    onClick={this.handleClickMain.bind(this) }
                    >Main</div>
            </div>;
        } else {
            return <div className="siteHeader__section"></div>;
        }
    }

    private showRightMenu(): JSX.Element {
        const SETTINGS_CLASS = `siteHeader__item siteHeaderButton ${this.selectedMenuItem("Settings")}`;

        if (this.state.isLogin) {
            return <div className="siteHeader__section">
                <div
                    className={SETTINGS_CLASS}
                    onClick={this.handleClickSettings.bind(this) }
                    >Settings</div>
                <div className="siteHeader__item siteHeaderButton">
                    <img src={ this.state.photoURL }
                        className="siteHeader__item siteHeaderButton"
                        onClick={this.handleClickLogout.bind(this) } />
                </div>
            </div>;
        } else {
            return <div className="siteHeader__section">
                <div className="siteHeader__item siteHeaderButton is-site-header-item-selected">
                    Log in
                </div>
            </div>;
        }
    }

    private showContents(): JSX.Element {
        if (this.state.isLogin) {
            switch (this.state.selectedMenuItem) {
                case "Main":
                    return <Chat
                        uid={this.state.uid}
                        displayName={this.state.displayName}
                        usersRef={this.usersRef}
                        loginAction={this.loginAction}
                        loginEvent={this.loginEvent}
                        chatRef={this.dbRef.child("chat") }
                        />;
                case "Settings":
                    return <p>Settings</p>;
            }

        } else {
            return <Login usersRef={this.usersRef} action={this.loginAction}  />;
        }
    }

    render() {
        return (
            <div className="app">
                <div className="siteHeader">
                    {this.showLeftMenu() }
                    {this.showRightMenu() }
                </div>
                {this.showContents() }
            </div>
        );
    }
}