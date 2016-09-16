import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../actionCreators/dispatcher";
import {LoginAction} from "../actionCreators/loginAction";
import {IUserInfo} from "../definition/definitions";
import {UserInfoUtil} from "../utils/userInfo";

interface LoginProps {
    usersRef: Firebase.database.Reference;
    loginAction: LoginAction;
}

interface LoginState {
    uid: string;
    displayName: string;
    photoURL: string;
}

export default class Login extends React.Component<LoginProps, LoginState> {
    constructor(props) {
        super(props);
        this.state = {
            uid: "",
            photoURL: "",
            displayName: "",
        };
    }

    private handleClickLogin() {
        if (this.state.uid !== "") {
            this.props.loginAction.login({
                uid: this.state.uid,
                displayName: this.state.displayName,
                photoURL: this.state.photoURL,
                updateTime: new Date()
            });
        } else {
            alert("twitterボタンを押して、認証してからクリックしてください。");
        }

    }

    private handleName(e: KeyboardEvent) {
        const textValue = (e.target as HTMLSelectElement).value;

        this.setState({
            uid: this.state.uid,
            photoURL: this.state.photoURL,
            displayName: textValue
        });
    }

    private handleTwitterAuth() {
        const provider = new Firebase.auth.TwitterAuthProvider();

        Firebase.auth().signInWithPopup(provider).then((result) => {
            const user = result.user;
            this.props.usersRef.child(user.uid).once("value").then((snapShot) => {
                const dbUser: IUserInfo = snapShot.val() === null ? null : UserInfoUtil.toUserInfo(snapShot.val());
                this.setState({
                    uid: user.uid,
                    displayName: dbUser === null ? user.displayName : dbUser.displayName,
                    photoURL: user.photoURL
                });
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    public render() {
        return <div className="login-container">
            <h1>Firebase Chat</h1>
            <div className="login-form">
                <h2>Log in to your account</h2>
                <input id="twitter-button" type="button" value="Twitter"
                    onClick={ this.handleTwitterAuth.bind(this) }
                    />
                <img src={ this.state.photoURL } />
                <div className="InputAddOn">
                    <i className="fa fa-user InputAddOn-item" aria-hidden="true"></i>
                    <input
                        className="InputAddOn-field"
                        value={ this.state.displayName }
                        placeholder="Name"
                        onChange={ this.handleName.bind(this) }
                        />
                </div>
                <input id="login-button" type="button" value="Log in"
                    disabled={this.state.uid === ""}
                    onClick={ this.handleClickLogin.bind(this) }
                    />
            </div>
        </div>;
    }
}
