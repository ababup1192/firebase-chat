import {List, Record} from "immutable";
import Dispatcher from "../../src/script/actionCreators/dispatcher";
import {UserInfo} from "../../src/script/definitions/userInfo";
import {Message} from "../../src/script/definitions/message";
import {ChatAction} from "../../src/script/actionCreators/chatAction";

describe("ChatAction", () => {
    it("should return pushed message", () => {
        const now = new Date();
        const message = Message.create(
            "abcd",
            "ABCD",
            "http://photo/abcd.jpg",
            List<UserInfo>(),
            "content",
            now);
        const expected = List.of(message);
        const chatAction = new ChatAction(new Dispatcher());
        const chatEvent = chatAction.createProperty();
        chatEvent.skip(1).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        chatAction.push(message);
        chatAction.end();
    });
    it("should return pushed messages", () => {
        const now = new Date();
        const message1 = Message.create(
            "abcd",
            "ABCD",
            "http://photo/abcd.jpg",
            List<UserInfo>(),
            "content1",
            now);
        const message2 = Message.create(
            "abcd",
            "ABCD",
            "http://photo/abcd.jpg",
            List<UserInfo>(),
            "content2",
            now);

        const expected = List.of(message1, message2);
        const chatAction = new ChatAction(new Dispatcher());
        const chatEvent = chatAction.createProperty();
        chatEvent.skip(1).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        chatAction.pushList(List.of(message1, message2));
        chatAction.end();
    });
    it("should return double pushed messages", () => {
        const now = new Date();
        const message1 = Message.create(
            "abcd",
            "ABCD",
            "http://photo/abcd.jpg",
            List<UserInfo>(),
            "content1",
            now);
        const message2 = Message.create(
            "abcd",
            "ABCD",
            "http://photo/abcd.jpg",
            List<UserInfo>(),
            "content2",
            now);

        const expected = List.of(message1, message2);
        const chatAction = new ChatAction(new Dispatcher());
        const chatEvent = chatAction.createProperty();
        chatEvent.skip(2).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        chatAction.push(message1); // spkip2
        chatAction.push(message2); // actual
        chatAction.end();
    });
});

