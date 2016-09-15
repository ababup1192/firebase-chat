import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import {IMessage, ChatAction} from "../actionCreators/chatAction";

interface MessageBoxProps {
    uid: string;
    chatRef: Firebase.database.Reference;
    chatAction: ChatAction;
    chatEvent: Bacon.Property<IMessage, List<IMessage>>;
}

interface MessageBoxState {
    messageList: List<IMessage>;
}

export default class MessageBox extends React.Component<MessageBoxProps, MessageBoxState> {
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.state = { messageList: List<IMessage>() };
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
        this.autoScroll();
    }

    public componentWillMount() {
        this.isMount = true;

        this.props.chatEvent.onValue((newMessageList: List<IMessage>) => {
            if (this.isMount) {
                this.setState({ messageList: newMessageList });
            }
        });

        this.props.chatRef.on("child_added", (snapShot: Firebase.database.DataSnapshot) => {
            const newMessage: IMessage = snapShot.val();
            this.props.chatAction.innerPost({
                uid: newMessage.uid,
                to: List(newMessage.to),
                name: newMessage.name,
                content: newMessage.content
            });
        });
    }

    public componentWillUnmount() {
        this.isMount = false;
    }

    render() {
        return <ul className="messagebox" ref="messagebox">
            {
                this.state.messageList.filter((message) =>
                    message.to.isEmpty() || message.uid === this.props.uid || message.to.some((m) => m.uid === this.props.uid)
                ).map((message, lidx) => {
                    const to = `( ${message.to.isEmpty() ? "ALL" : message.to.map((m) =>
                        m.uid === this.props.uid ? "ME" : m.displayName).join(" and ")} )`;
                    return <li key={`box-line-${lidx}`} className={message.uid === this.props.uid ? "message-me" : "message-other"}>
                        <p key={`box-line-${lidx}-header`}>{`${message.name}  =>  ${to}`}</p>
                        {message.content.split("\n").map((line, pidx) =>
                            <p key={`box-line-${lidx}-p-${pidx}`}>{line}</p>
                        ) }
                    </li>;
                })
            }
        </ul>;
    }
}