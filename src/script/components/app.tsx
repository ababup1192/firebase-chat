import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Immutable from "immutable";

import Chat from "./Chat.tsx";


export default class App extends React.Component<any, any> {
    render() {
        return (
            <Chat contents={
                Immutable.List.of(
                    { name: "mira", content: "みらだよー" },
                    { name: "mizi", content: "みじだよー" },
                    { name: "mira", content: "ふたりあわせてー" },
                    { name: "mizi", content: "みじだよー" }
                )
            }/>
        );
    }
}