import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Immutable from "immutable";

interface Post {
    name: string;
    content: string;
}

interface ChatProps {
    contents: Immutable.List<Post>;
}

export default class Chat extends React.Component<ChatProps, any> {
    constructor(props) {
        super(props);
    }

    handleKey(e: KeyboardEvent) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            (e.target as HTMLSelectElement).value = "";
        }
    }

    render() {
        const contents = this.props.contents.map((post, idx) => {
            if (post.name === "mira") {
                return <li key={idx} className="right">
                    <p>{post.content}</p>
                </li>;
            } else {
                return <li key={idx} className="left">
                    <p>{post.content}</p>
                </li>;
            }
        });

        const form = <li className="write-new">
            <textarea
                placeholder="Write your comment here"
                name="comment"
                onKeyPress={this.handleKey.bind(this) }
                ></textarea>
        </li>;

        return <ul className="comment-section">
            {contents}
            {form}
        </ul>;
    }
}