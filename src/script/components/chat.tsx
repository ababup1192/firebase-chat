import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List} from "immutable";
import {ChatAction, Post} from "../actionCreators/chatAction";

interface ChatProps {
    user: string;
    action: ChatAction;
    event: Bacon.Property<Post, List<Post>>;
    chatRef: Firebase.database.Reference;
}

export default class Chat extends React.Component<ChatProps, { postLog: List<Post> }> {
    private isMount: boolean;

    constructor(props) {
        super(props);
        this.state = { postLog: List<Post>() };

        this.isMount = false;
    }

    public componentWillMount(): void {
        this.isMount = true;

        this.props.event.onValue((newPostLogs: List<Post>) => {
            if (this.isMount) {
                this.setState({ postLog: newPostLogs });
            }
        });

        this.props.chatRef.on("child_added", (ss: Firebase.database.DataSnapshot) => {
            if (this.isMount) {
                const post: Post = ss.val();
                this.props.action.innerPost(post);
            }
        });
    }

    public componentWillUnmount(): void {
        this.isMount = false;
    }

    public componentDidUpdate(): void {
        const chatMain = ReactDOM.findDOMNode(this.refs["chat-main"]) as HTMLLIElement;
        chatMain.scrollTop = chatMain.scrollHeight;
    }

    handleKey(e: KeyboardEvent) {
        if ((e.which === 13 || e.keyCode === 13) && !e.shiftKey) {
            e.preventDefault();

            const textValue = (e.target as HTMLSelectElement).value;
            if (textValue !== "") {
                this.props.action.post({
                    name: this.props.user,
                    content: textValue
                });
            }
            (e.target as HTMLSelectElement).value = "";
        }
    }

    render() {
        const contents = this.state.postLog.map((post, lidx) => {
            return <li key={`chat-line-${lidx}`} className={post.name === this.props.user ? "right" : "left"}>
                {post.content.split("\n").map((line, pidx) =>
                    <p key={`chat-line-${lidx}-p-${pidx}`}>{line}</p>
                ) }
            </li>;
        });

        const form = <li className="write-new">
            <textarea
                placeholder="Write your comment here"
                name="comment"
                onKeyPress={this.handleKey.bind(this) }></textarea>
        </li>;

        return <ul className="comment-section">
            <ul className="chat-main" ref="chat-main">
                {contents}
            </ul>
            {form}
        </ul>;
    }
}