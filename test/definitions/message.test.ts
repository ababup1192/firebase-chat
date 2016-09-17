import {List, Record, Map} from "immutable";
import {Message} from "../../src/script/definitions/message";
import {UserInfo} from "../../src/script/definitions/userInfo";

describe("Message", () => {
    const UID = "abcd";
    const DISPLAY_NAME = "ABCD";
    const PHOTO_URL = "http://photo/abcd.jpg";
    const NOW = new Date();
    const TO = List.of(
        UserInfo.create("efgh", "EFGH", "http://photo/efgh.jpg", NOW),
        UserInfo.create("ijkl", "IJKL", "http://photo/IJKL.jpg", NOW),
        UserInfo.create("mnop", "MNOP", "http://photo/mnop.jpg", NOW)
    );
    const CONTENT = "content";
    const record = Record({
        uid: UID, displayName: DISPLAY_NAME, photoURL: PHOTO_URL,
        to: TO, content: CONTENT, postTime: NOW
    })();
    const message = Message.create(UID, DISPLAY_NAME, PHOTO_URL, TO, CONTENT, NOW);

    it("should create", () => {
        const expected = record;
        const actual = message;
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should access uid", () => {
        const expected = UID;
        const actual = message.uid();
        chai.assert.equal(expected, actual);
    });
    it("should access displayName", () => {
        const expected = DISPLAY_NAME;
        const actual = message.displayName();
        chai.assert.equal(expected, actual);
    });
    it("should access photoURL", () => {
        const expected = PHOTO_URL;
        const actual = message.photoURL();
        chai.assert.equal(expected, actual);
    });
    it("should access to", () => {
        const expected = TO;
        const actual = message.to();
        chai.assert.equal(expected, actual);
    });
    it("should access content", () => {
        const expected = CONTENT;
        const actual = message.content();
        chai.assert.equal(expected, actual);
    });
    it("should access postTime", () => {
        const expected = NOW;
        const actual = message.postTime();
        chai.assert.equal(expected, actual);
    });
    it("should return true if toUsers is empty", () => {
        const emptyMessage = Message.create(UID, DISPLAY_NAME,
            PHOTO_URL, List<UserInfo>(), CONTENT, NOW);
        const expected = true;
        const actual = emptyMessage.isAllMessage();
        chai.assert.equal(expected, actual);
    });
    it("should return false if toUsers is not empty", () => {
        const expected = false;
        const actual = message.isAllMessage();
        chai.assert.equal(expected, actual);
    });
    it("should return true if sender is me", () => {
        const expected = true;
        const actual = message.isShow(UID);
        chai.assert.equal(expected, actual);
    });
    it("should return true if message is for all", () => {
        const emptyMessage = Message.create(UID, DISPLAY_NAME,
            PHOTO_URL, List<UserInfo>(), CONTENT, NOW);
        const expected = true;
        const actual = emptyMessage.isShow("xxxx");
        chai.assert.equal(expected, actual);
    });
    it("should return false", () => {
        const expected = false;
        const actual = message.isShow("xxxx");
        chai.assert.equal(expected, actual);
    });
    it("should return true if toUser have me", () => {
        const expected = true;
        const actual = message.isShow("ijkl");
        chai.assert.equal(expected, actual);
    });

    it("should return ALL", () => {
        const expected = "(ALL)";
        const emptyMessage = Message.create(UID, DISPLAY_NAME,
            PHOTO_URL, List<UserInfo>(), CONTENT, NOW);
        const actual = emptyMessage.toUsersString(emptyMessage.uid());
        chai.assert.equal(expected, actual);
    });
    it("should return ToUserString", () => {
        const expected = "EFGH and IJKL and MNOP";
        const actual = message.toUsersString(message.uid());
        chai.assert.equal(expected, actual);
    });
    it("should return ToUserString With ME", () => {
        const expected = "EFGH and (ME) and MNOP";
        const actual = message.toUsersString("ijkl");
        chai.assert.equal(expected, actual);
    });
    it("should return className me", () => {
        const expected = "message-me";
        const actual = message.className(UID);
        chai.assert.equal(expected, actual);
    });
    it("should return messageClassName other", () => {
        const expected = "message-other";
        const actual = message.className("ijkl");
        chai.assert.equal(expected, actual);
    });
    it("should change Message", () => {
        const expected = message;
        const actual = Message.fromFirebaseObj(message.toFirebaseObj());
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should change MessageList", () => {
        const expected = List.of(message);
        const actual = Message.toMessageList(
            { [message.uid()]: message.toFirebaseObj() }
        );
        chai.assert.isTrue(expected.equals(actual));
    });
});