import {List, Record, Map} from "immutable";
import {UserInfo} from "../../src/script/definitions/userInfo";

describe("UserrInfo", () => {
    it("should create", () => {
        const now = new Date();
        const expected = Record({ uid: "abcd", displayName: "ABCD", photoURL: "http://photo/abcd.jpg", updateTime: now })();
        const actual = UserInfo.create("abcd", "ABCD", "http://photo/abcd.jpg", now);
        chai.assert.isTrue(expected.equals(actual));
    });
    /*
    it("should access isLogin", () => {
        const expected = true;
        const actual = HeaderInfo.create(true, "Log in").isLogin();
        chai.assert.equal(expected, actual);
    });
    it("should access selectedItem", () => {
        const expected = "Log in";
        const actual = HeaderInfo.create(false, "Log in").selectedItem();
        chai.assert.equal(expected, actual);
    });
    it("should return LoginState", () => {
        const expected = HeaderInfo.create(true, "Main");
        const actual = HeaderInfo.login();
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should return LogoutState", () => {
        const expected = HeaderInfo.create(false, "Log in");
        const actual = HeaderInfo.logout();
        chai.assert.isTrue(expected.equals(actual));
    });
    it("should chage selectedItem", () => {
        const expected = HeaderInfo.create(true, "Settings");
        const actual = HeaderInfo.login().changeItem("Settings");
        chai.assert.isTrue(expected.equals(actual));
    });
    */
});