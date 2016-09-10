import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import {List} from "immutable";
import * as Firebase from "firebase";

const POST = "POST";
const INNER_POST = "INNER_POST";

export interface Post {
    name: string;
    content: string;
}

export class ActionCreator {
    private d: Dispatcher;
    private ref: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, ref: Firebase.database.Reference) {
        this.d = dispatcher;
        this.ref = ref;
    }

    public post(post: Post): void {
        this.d.push(POST, post);
    }

    public innerPost(post: Post): void {
        this.d.push(INNER_POST, post);
    }

    public createProperty(): Bacon.Property<Post, List<Post>> {
        return Bacon.update<Post, Post, Post, List<Post>>(List<Post>(),
            [this.d.stream(POST)], this._post.bind(this),
            [this.d.stream(INNER_POST)], this._innerPost);
    }

    private _post(postLogs: List<Post>, post: Post): List<Post> {
        this.ref.child("abc").push(post);
        return postLogs;
    }

    private _innerPost(postLogs: List<Post>, post: Post): List<Post> {
        return postLogs.push(post);
    }
}