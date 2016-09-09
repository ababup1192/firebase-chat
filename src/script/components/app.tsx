import * as React from "react";
import * as ReactDOM from "react-dom";
import {List} from "immutable";
import * as Firebase from "firebase";

import Dispatcher from "../dispatcher";
import {ActionCreator, Post} from "../actionCreator";
import Chat from "./Chat.tsx";

interface AppProps {
    user: string;
}

export default class App extends React.Component<AppProps, any> {
    private dispatcher: Dispatcher;
    private action: ActionCreator;
    private appEvent: Bacon.Property<Post, List<Post>>;
    constructor(props) {
        super(props);
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

        dbRef.on("child_added", (ss: Firebase.database.DataSnapshot) => {
            const post: Post = ss.val();
            this.action.innerPost(post);
        });
    }

    render() {
        return (
            <Chat user={this.props.user} action={this.action} appEvent={this.appEvent}/>
        );
    }
}