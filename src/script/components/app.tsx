import * as React from "react";
import * as ReactDOM from "react-dom";
import {List} from "immutable";
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
        this.action = new ActionCreator(this.dispatcher);
        this.appEvent = this.action.createProperty();
    }

    render() {
        return (
            <Chat user={this.props.user} action={this.action} appEvent={this.appEvent}/>
        );
    }
}