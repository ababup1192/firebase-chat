import {List, Record, Iterable} from "immutable";
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
    it("should return pushed system message", () => {
        const CONTENT = "system message";
        const now = new Date();
        const message = Message.create(
            "system",
            "SYSTEM",
            "",
            List<UserInfo>(),
            CONTENT,
            now);
        const expected = List.of(message);
        const chatAction = new ChatAction(new Dispatcher());
        const chatEvent = chatAction.createProperty();
        chatEvent.skip(1).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        chatAction.systemPush(CONTENT, now);
        chatAction.end();
    });
    it("group by", () => {
        interface Mem {
            id: string;
            num: number;
        }
        const id1 = "id1";
        const id2 = "id2";
        const group = List.of<Mem>(
            { id: id1, num: 1 },
            { id: id1, num: 2 },
            { id: id2, num: 3 },
            { id: id2, num: 7 },
            { id: id1, num: 8 },
            { id: id1, num: 9 },
            { id: id1, num: 12 },
            { id: id1, num: 15 },
            { id: id1, num: 18 }
        ).groupBy((mem: Mem, key: number, iter: Iterable<number, Mem>) => {
            function collectGroupKeys(curKey: number,
                desc = true, keys = List<number>()): List<number> {
                const pastKey = curKey + (desc ? -1 : +1);
                const pastNum = iter.has(pastKey) ? iter.get(pastKey).num : Number.MAX_VALUE;
                if (curKey < 0 || curKey > iter.keySeq().last() ||
                    iter.get(curKey).id !== mem.id ||
                    Math.abs(pastNum - iter.get(curKey).num) > 3) {
                    return keys;
                } else {
                    return desc ?
                        collectGroupKeys(curKey + 1, true, keys.push(curKey)) :
                        collectGroupKeys(curKey - 1, false, keys.unshift(curKey));
                }
            }
            return collectGroupKeys(key - 1, false, List.of(key)).concat(collectGroupKeys(key + 1, true)).join("");
        }).map((group) => group.map((value) => JSON.stringify(value))).toJS();
        console.log(group);
    });
});

