import {List, Record} from "immutable";
import {HeaderInfo} from "../../src/script/definitions/headerInfo";

describe("HeaderInfo", () => {
    it("should create", () => {
        const expected = Record({ isLogin: false, selectedItem: "Log in" })();
        const actual = HeaderInfo.create(false, "Log in");
        chai.assert.isTrue(expected.equals(actual));
    });
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
});
