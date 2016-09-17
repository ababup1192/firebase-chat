import {List, Record, Map} from "immutable";
import {UserInfo} from "../../src/script/definitions/userInfo";

describe("UserrInfo", () => {
    const UID = "abcd";
    const DISPLAY_NAME = "ABCD";
    const PHOTO_URL = "http://photo/abcd.jpg";
    const NOW = new Date();
    const record = Record({ uid: UID, displayName: DISPLAY_NAME, photoURL: PHOTO_URL, updateTime: NOW })();
    const userInfo = UserInfo.create(UID, DISPLAY_NAME, PHOTO_URL, NOW);

    it("should create", () => {
        const expected = record;
        const actual = userInfo;
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should access uid", () => {
        const expected = UID;
        const actual = userInfo.uid();
        chai.assert.equal(expected, actual);
    });
    it("should access displayName", () => {
        const expected = DISPLAY_NAME;
        const actual = userInfo.displayName();
        chai.assert.equal(expected, actual);
    });
    it("should access photoURL", () => {
        const expected = PHOTO_URL;
        const actual = userInfo.photoURL();
        chai.assert.equal(expected, actual);
    });
    it("should access updateTime", () => {
        const expected = NOW;
        const actual = userInfo.updateTime();
        chai.assert.equal(expected, actual);
    });
    it("should change displayName", () => {
        const expected = UserInfo.create(UID, "EFGH", PHOTO_URL, NOW);
        const actual = userInfo.changeDisplayName("EFGH");
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should change FirebaseObj", () => {
        const expected = Record({ uid: UID, displayName: DISPLAY_NAME, photoURL: PHOTO_URL, updateTime: NOW.getTime() })();
        const actual = Record(userInfo.toFirebaseObj())();
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should change UserInfo", () => {
        const expected = userInfo;
        const actual = UserInfo.fromFirebaseObj(userInfo.toFirebaseObj());
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should change UserInfoList", () => {
        const expected = List.of(userInfo);
        const actual = UserInfo.toUserInfoList({ [UID]: userInfo.toFirebaseObj() });
        chai.assert.isTrue(expected.equals(actual));
    });
});