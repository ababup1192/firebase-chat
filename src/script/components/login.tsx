import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../actionCreators/dispatcher";
import {LoginAction, UserInfo} from "../actionCreators/loginAction";

interface LoginProps {
    usersRef: Firebase.database.Reference;
    action: LoginAction;
}

interface LoginState {
    uid: string;
    photoURL: string;
    displayName: string;
}

export default class Login extends React.Component<LoginProps, LoginState> {
    constructor(props) {
        super(props);
        this.state = {
            uid: "",
            photoURL: "",
            displayName: ""
        };
    }

    private handleClickLogin() {
        if (this.state.uid !== "") {
            this.props.action.login({
                uid: this.state.uid,
                photoURL: this.state.photoURL,
                displayName: this.state.displayName
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
            this.setState({
                uid: user.uid,
                photoURL: user.photoURL,
                displayName: user.displayName
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    public render() {
        return <form className="loginForm">
            <input type="button" value="twitter"
                onClick={ this.handleTwitterAuth.bind(this) }
                />
            <img src={ this.state.photoURL } />
            <div className="InputAddOn">
                <span className="InputAddOn-item">Name</span>
                <input
                    className="InputAddOn-field"
                    value={ this.state.displayName }
                    onChange={ this.handleName.bind(this) }
                    />
            </div>
            <input type="button" value="Log in"
                onClick={ this.handleClickLogin.bind(this) }
                />
        </form>;
    }
}
