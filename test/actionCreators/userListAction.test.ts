import {List, Record} from "immutable";
import {UserInfo} from "../../src/script/definitions/UserInfo";
import Dispatcher from "../../src/script/actionCreators/dispatcher";
import {UserListAction} from "../../src/script/actionCreators/userListAction";

describe("UserListAction", () => {
    it("should return initial value", () => {
        const now = new Date();
        const expected = List<UserInfo>();
        const userListAction = new UserListAction(new Dispatcher());
        const userListEvent = userListAction.createProperty();
        userListEvent.onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
    });
});

