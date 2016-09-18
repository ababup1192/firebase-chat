import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";

import {Message} from "../definitions/message";
import {ChatAction} from "../actionCreators/chatAction";

interface MessageBoxProps {
    uid: string;
    chatRef: Firebase.database.Reference;
    chatAction: ChatAction;
    chatEvent: Bacon.Property<List<Message>, List<Message>>;
}

interface MessageBoxState {
    messageList: List<Message>;
}

export default class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {
    constructor(props) {
        super(props);

        this.state = { messageList: List<Message>() };
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
        this.props.chatEvent.onValue((messages) => {
            this.setState({ messageList: messages });
        });
        this.props.chatRef.on("child_added", (snapShot: Firebase.database.DataSnapshot) => {
            const firebaseMessage = snapShot.val();
            this.props.chatAction.push(Message.fromFirebaseObj(firebaseMessage));
        });
        this.autoScroll();
    }

    render() {
        const placeHolder = (message: Message) => `${message.displayName()}  =>  ${message.toUsersString(this.props.uid)}`;
        return <ul className="messagebox" ref="messagebox">
            {
                this.state.messageList.filter((message) => message.isShow(this.props.uid)).map((message, lidx) => {
                    return <li key={`box-line-${lidx}`} className={message.className(this.props.uid) }>
                        <p key={`box-line-${lidx}-header`}>{placeHolder(message) }</p>
                        {message.content().split("\n").map((line, pidx) =>
                            <p key={`box-line-${lidx}-p-${pidx}`}>{line}</p>
                        ) }
                    </li>;
                })
            }
        </ul>;
    }
}