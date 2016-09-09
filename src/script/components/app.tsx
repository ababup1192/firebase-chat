import * as React from "react";
import * as ReactDOM from "react-dom";
import Dispatcher from "../dispatcher";
import {ActionCreator, Post} from "../actionCreator";
import {List} from "immutable";

import Chat from "./Chat.tsx";

export default class App extends React.Component<any, any> {
    private dispatcher: Dispatcher;
    private action: ActionCreator;
    private appEvent: Bacon.Property<Post, List<Post>>;

    constructor() {
        super();
        this.dispatcher = new Dispatcher();
        this.action = new ActionCreator(this.dispatcher);
        this.appEvent = this.action.createProperty();
    }

    render() {
        return (
            <Chat action={this.action} appEvent={this.appEvent}/>
        );
    }
}