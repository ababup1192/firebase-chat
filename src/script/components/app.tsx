import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../dispatcher";
import {ActionCreator, Post} from "../actionCreator";
import Chat from "./chat.tsx";
import Login from "./login.tsx";


interface AppProps {
    user: string;
}
/*
const AppStateRecord = Record({
    isLogin: false,
    selectedMenuItem: "Log in",
    uid: ""
});
class AppState extends AppStateRecord {

    private IS_LOGIN = "isLogin";
    private SELECTED_MENU_ITEM = "selectedMenuItem";
    private UID = "uid";

    public set(key: string, value: any): AppState {
        // super.set(key, value);
        console.log("set");
        return new AppState();
    }

    public isLogin(): boolean { return this.get(this.IS_LOGIN); }
    public selectedMenuItem(): string { return this.get(this.SELECTED_MENU_ITEM); }
    public uid(): string { return this.get(this.UID); }

    public setIsLogin(isLogin: boolean): AppState { return this.set(this.IS_LOGIN, isLogin); }
    public setSelectedMenuItem(selectedMenuItem: string): AppState {
        return this.set(this.SELECTED_MENU_ITEM, selectedMenuItem);
    }
    public setUID(uid: string): AppState {
        return this.set(this.UID, uid);
    }
}*/


interface AppState {
    isLogin: boolean;
    selectedMenuItem: string;
    uid: string;
}

export default class App extends React.Component<AppProps, AppState> {
    private dispatcher: Dispatcher;
    private action: ActionCreator;
    private appEvent: Bacon.Property<Post, List<Post>>;
    private usersRef: Firebase.database.Reference;

    constructor(props) {
        super(props);
        this.state = {
            isLogin: false,
            selectedMenuItem: "Log in",
            uid: ""
        };

        this.dispatcher = new Dispatcher();
        const firebaseConfig = {
            apiKey: "AIzaSyBP9yQTAUGxbq75j4qsBBc_IpYaswIw49M",
            authDomain: "fir-chat-d38c8.firebaseapp.com",
            databaseURL: "https://fir-chat-d38c8.firebaseio.com",
            storageBucket: "fir-chat-d38c8.appspot.com",
        };
        Firebase.initializeApp(firebaseConfig);
        const dbRef = Firebase.database().ref();
        this.action = new ActionCreator(this.dispatcher, dbRef);
        this.appEvent = this.action.createProperty();

        dbRef.child("abc").on("child_added", (ss: Firebase.database.DataSnapshot) => {
            const post: Post = ss.val();
            this.action.innerPost(post);
        });
        this.usersRef = dbRef.child("users");
    }

    private handleClick(isLogin, selectedMenuItem) {
        this.setState({
            isLogin: isLogin,
            selectedMenuItem: selectedMenuItem,
            uid: this.state.uid
        });
    }

    private handleClickMain() {
        this.handleClick(true, "Main");
    }

    private handleClickSettings() {
        this.handleClick(true, "Settings");
    }



    private handleClickLogout() {
        this.handleClick(false, "Log in");
    }

    private selectedItem(itemName): string {
        return itemName === this.state.selectedMenuItem ? "is-site-header-item-selected" : "";
    }

    private showLeftMenu(): JSX.Element {
        const MAIN_CLASS = `siteHeader__item siteHeaderButton ${this.selectedItem("Main")}`;
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
        const SETTINGS_CLASS = `siteHeader__item siteHeaderButton ${this.selectedItem("Settings")}`;

        if (this.state.isLogin) {
            return <div className="siteHeader__section">
                <div
                    className={SETTINGS_CLASS}
                    onClick={this.handleClickSettings.bind(this) }
                    >Settings</div>
                <div
                    className="siteHeader__item siteHeaderButton"
                    onClick={this.handleClickLogout.bind(this) }>
                    Log out
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
            return <Chat user={this.props.user} action={this.action} appEvent={this.appEvent}/>;
        } else {
            return <Login usersRef={this.usersRef} />;
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