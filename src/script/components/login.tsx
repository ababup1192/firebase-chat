import * as React from "react";
import * as ReactDOM from "react-dom";
import {List, Record} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../dispatcher";
import {ActionCreator, Post} from "../actionCreator";

interface LoginProps {
    usersRef: Firebase.database.Reference;
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
        /* Firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        });*/
        Firebase.auth().signInWithPopup(provider).then((result) => {
            const user = result.user;
            this.props.usersRef.child(user.uid).set({
                uid: user.uid,
                photoURL: user.photoURL,
                displayName: user.displayName
            });
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
