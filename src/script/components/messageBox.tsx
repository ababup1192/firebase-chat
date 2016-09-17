import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";

import {Message} from "../definitions/message";

interface MessageBoxProps {
    uid: string;
    chatRef: Firebase.database.Reference;
}

interface MessageBoxState {
    messageList: List<Message>;
}

export default class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.state = { messageList: List<Message>() };
        this.isMount = false;
    }

    private autoScroll() {
        const chatMain = ReactDOM.findDOMNode(this.refs["messagebox"]) as HTMLLIElement;
        if (chatMain) {
            chatMain.scrollTop = chatMain.scrollHeight;
        }
    }

    public componentDidUpdate() {
        this.autoScroll();
    }

    public componentDidMount() {
        this.isMount = true;
        this.props.chatRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
            const firebaseMessageList = snapShot.val();
            if (this.isMount && firebaseMessageList) {
                const messageList: List<Message> = Message.toMessageList(firebaseMessageList);
                this.setState({ messageList: messageList });
            }
        });
        this.autoScroll();
    }

    public componentWillUnmount() {
        this.isMount = false;
    }

    render() {
        const placeHolder = (message: Message) => `${message.displayName()}  =>  ${message.toUsersString(this.props.uid)}`;
        return <ul className="messagebox" ref="messagebox">
            {
                this.state.messageList.filter((message) => message.isShow(this.props.uid)).map((message, lidx) => {
                    return <li key={`box-line-${lidx}`} className={message.className(this.props.uid)}>
                        <p key={`box-line-${lidx}-header`}>{placeHolder(message)}</p>
                        {message.content().split("\n").map((line, pidx) =>
                            <p key={`box-line-${lidx}-p-${pidx}`}>{line}</p>
                        ) }
                    </li>;
                })
            }
        </ul>;
    }
}