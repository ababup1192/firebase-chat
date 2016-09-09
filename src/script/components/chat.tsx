import * as React from "react";
import * as ReactDOM from "react-dom";
import {List} from "immutable";
import {ActionCreator, Post} from "../actionCreator";

interface ChatProps {
    user: string;
    action: ActionCreator;
    appEvent: Bacon.Property<Post, List<Post>>;
}

export default class Chat extends React.Component<ChatProps, { postLog: List<Post> }> {
    constructor(props) {
        super(props);
        this.state = { postLog: List<Post>() };
    }

    public componentDidMount(): void {
        this.props.appEvent.onValue((newPostLogs: List<Post>) =>
            this.setState({ postLog: newPostLogs })
        );
    }

    handleKey(e: KeyboardEvent) {
        if (e.which === 13 || e.keyCode === 13) {
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
        const contents = this.state.postLog.map((post, idx) => {
            return <li key={idx} className={post.name === this.props.user ? "right" : "left"}>
                <p>{post.content}</p>
            </li>;
        });

        const form = <li className="write-new">
            <textarea
                placeholder="Write your comment here"
                name="comment"
                onKeyPress={this.handleKey.bind(this) }></textarea>
        </li>;

        return <ul className="comment-section">
            {contents}
            {form}
        </ul>;
    }
}