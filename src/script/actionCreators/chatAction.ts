import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import {List} from "immutable";
import * as Firebase from "firebase";
import {IUidWithName} from "./userListAction";

const POST = "POST";
const INNER_POST = "INNER_POST";
const RESET = "RESET";

export interface IMessage {
    uid: string;
    to: List<IUidWithName>;
    name: string;
    content: string;
}

export class ChatAction {
    private d: Dispatcher;
    private chatRef: Firebase.database.Reference;

    constructor(dispatcher: Dispatcher, chatRef: Firebase.database.Reference) {
        this.d = dispatcher;
        this.chatRef = chatRef;
    }

    public post(message: IMessage): void {
        this.d.push(POST, message);
    }

    public innerPost(message: IMessage): void {
        this.d.push(INNER_POST, message);
    }

    public end() {
        this.d.stream(POST).end();
        this.d.stream(INNER_POST).end();
    }

    public createProperty(): Bacon.Property<IMessage, List<IMessage>> {
        return Bacon.update<IMessage, IMessage, any, List<IMessage>>(List<IMessage>(),
            [this.d.stream(POST)], this._post.bind(this),
            [this.d.stream(INNER_POST)], this._innerPost
        );
    }

    private _post(messageList: List<IMessage>, newMessage: IMessage): List<IMessage> {
        this.chatRef.push({
            uid: newMessage.uid, to: newMessage.to.toJS()
            , name: newMessage.name, content: newMessage.content
        });
        return messageList;
    }

    private _innerPost(messageList: List<IMessage>, newMessage: IMessage): List<IMessage> {
        return messageList.push(newMessage);
    }
}