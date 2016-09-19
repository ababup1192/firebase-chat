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
}

interface MessageBoxState {
    messageList: List<Message>;
}

export default class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {
    private chatEvent: Bacon.Property<List<Message>, List<Message>>;

    constructor(props) {
        super(props);

        this.state = { messageList: List<Message>() };
        this.chatEvent = this.props.chatAction.createProperty();
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
        this.chatEvent.onValue((messages) => {
            this.setState({ messageList: messages.sortBy((message) => message.postTime().getTime()).toList() });
        });
        this.props.chatRef.on("child_added", (snapShot: Firebase.database.DataSnapshot) => {
            const firebaseMessage = snapShot.val();
            this.props.chatAction.push(Message.fromFirebaseObj(firebaseMessage));
        });
        this.autoScroll();
    }

    // <div key={`box-line-${lidx}-header`} className="messageContent">
    render() {
        const placeHolder = (message: Message) => `${message.displayName()}${message.isAllMessage() ? "" : " (secret)"}`;
        return <ul className="messagebox" ref="messagebox">
            {
                this.state.messageList.filter((message) => message.isShow(this.props.uid)).map((message, lidx) => {
                    return <li key={`box-line-${lidx}`} className="message">
                        <div>
                            <img src={message.photoURL() } />
                        </div>
                        <div className="messageContent">
                            <div className="boxNameAndDate">
                                <p className="boxName">{ placeHolder(message) }</p>
                                <p className="boxDate">{ message.showPostTimeAMPM() }</p>
                            </div>
                            <div>
                                {message.content().split("\n").map((line, pidx) =>
                                    <p key={`box-line-${lidx}-p-${pidx}`} className="boxContent">{line}</p>
                                ) }
                            </div>
                        </div>
                    </li>;
                })
            }
        </ul>;
    }
}