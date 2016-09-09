import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import {List} from "immutable";

const POST_TEXT = "POST";

export interface Post {
    name: string;
    content: string;
}

export class ActionCreator {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public postText(post: Post): void {
        this.d.push(POST_TEXT, post);
    }

    public createProperty(): Bacon.Property<Post, List<Post>> {
        return Bacon.update<Post, Post, List<Post>>(List<Post>(),
            [this.d.stream(POST_TEXT)], this._postText);
    }

    private _postText(postLogs: List<Post>, post: Post): List<Post> {
        return postLogs.push(post);
    }
}