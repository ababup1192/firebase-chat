import * as Bacon from "baconjs";
import Dispatcher from "./dispatcher";
import * as Firebase from "firebase";
import {List} from "immutable";
import {Message} from "../definitions/message";

const PUSH = "PUSH";
const PUSH_LIST = "PUSH_LIST";

export class ChatAction {
    private d: Dispatcher;

    constructor(dispatcher: Dispatcher) {
        this.d = dispatcher;
    }

    public push(message: Message) {
        this.d.push(PUSH, message);
    }

    public pushList(messages: List<Message>) {
        this.d.push(PUSH_LIST, messages);
    }

    public end() {
        this.d.stream(PUSH).end();
        this.d.stream(PUSH_LIST).end();
    }

    public createProperty(): Bacon.Property<List<Message>, List<Message>> {
        return Bacon.update<List<Message>, Message, List<Message>, List<Message>>(List<Message>(),
            [this.d.stream(PUSH)], this._push.bind(this),
            [this.d.stream(PUSH_LIST)], this._pushList.bind(this)
        );
    }

    private _push(old: List<Message>, message: Message): List<Message> {
        return old.push(message);
    }
    private _pushList(old: List<Message>, messages: List<Message>): List<Message> {
        return old.concat(messages).toList();
    }
}