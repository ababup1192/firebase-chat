import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import {ChatAction, Post} from "../actionCreators/chatAction";

interface ChatProps {
    uid: string;
    displayName: string,
    action: ChatAction;
    event: Bacon.Property<Post, List<Post>>;
    usersRef: Firebase.database.Reference;
    chatRef: Firebase.database.Reference;
}

interface ChatState {
    usersList: List<string>;
    postLog: List<Post>;
}

export default class Chat extends React.Component<ChatProps, ChatState> {
    private isMount: boolean;

    constructor(props) {
        super(props);
        this.state = { usersList: List<string>(), postLog: List<Post>() };

        this.isMount = false;
    }

    public componentWillMount(): void {
        this.isMount = true;

        this.props.usersRef.remove();
        setInterval(() => this.props.usersRef.remove(), 20 * 1000);

        this.props.event.onValue((newPostLogs: List<Post>) => {
            if (this.isMount) {
                this.setState({ usersList: this.state.usersList, postLog: newPostLogs });
            }
        });

        this.props.chatRef.on("child_added", (ss: Firebase.database.DataSnapshot) => {
            if (this.isMount) {
                const post: Post = ss.val();
                this.props.action.innerPost(post);
            }
        });

        this.props.usersRef.on("value", (ss: Firebase.database.DataSnapshot) => {
            const currentUser = Firebase.auth().currentUser;
            this.props.usersRef.child(currentUser.uid).once("value", (snapShot) => {
                if (snapShot.val() === null) {
                    this.props.usersRef.child(currentUser.uid).set({
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    });
                }
            });

            if (ss.val()) {
                setTimeout(() =>
                    this.props.usersRef.once("value", function(snapShot){
                        const value = snapShot.val();
                        const users = List(Object.keys(value).map((key, idx) => value[key].displayName).sort());
                        this.setState({ usersList: users, postLog: this.state.postLog });
                    }.bind(this)), 2 * 1000);
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
                    uid: this.props.uid,
                    name: this.props.displayName,
                    content: textValue
                });
            }
            (e.target as HTMLSelectElement).value = "";
        }
    }

    render() {
        const usersList = this.state.usersList.map((user, idx) =>
            <li key={`users-${idx}`}>{user}</li>
        );
        const contents = this.state.postLog.map((post, lidx) => {
            return <li key={`chat-line-${lidx}`} className={post.uid === this.props.uid ? "right" : "left"}>
                <p key={`chat-line-${lidx}-header`}>{`${post.name} :`}</p>
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

        return <div className="chat-container">
            <ul className="users-list">
                {usersList}
            </ul>
            <ul className="comment-section">
                <ul className="chat-main" ref="chat-main">
                    {contents}
                </ul>
                {form}
            </ul>
        </div>;
    }
}