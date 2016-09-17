import {List, Record} from "immutable";
import {UserInfo} from "../../src/script/definitions/userInfo";
import Dispatcher from "../../src/script/actionCreators/dispatcher";
import {LoginAction} from "../../src/script/actionCreators/loginAction";

describe("LoginAction", () => {
    it("should return initial value", () => {
        const now = new Date();
        const expected = UserInfo.create("abcd", "ABCD", "http://photo/abcd.jpg", now);
        const loginAction = new LoginAction(new Dispatcher());
        const loginEvent = loginAction.createProperty();
        loginEvent.skip(1).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        loginAction.login(UserInfo.create("abcd", "ABCD", "http://photo/abcd.jpg", now));
        loginAction.end();
    });
});

