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
    it("should return user list", () => {
        const now = new Date();
        const user1 = UserInfo.create("efgh", "EFGH", "http://photo/efgh.jpg", now);
        const user2 = UserInfo.create("ijkl", "IJKL", "http://photo/IJKL.jpg", now);
        const user3 = UserInfo.create("mnop", "MNOP", "http://photo/mnop.jpg", now);

        const expected = List.of(user1, user2, user3);
        const userListAction = new UserListAction(new Dispatcher());
        const userListEvent = userListAction.createProperty();
        userListEvent.skip(3).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        userListAction.push(user1); // skip2
        userListAction.push(user2); // skip3
        userListAction.push(user3); // actual
        userListAction.end();
    });
    it("should return deleted user list", () => {
        const now = new Date();
        const user1 = UserInfo.create("efgh", "EFGH", "http://photo/efgh.jpg", now);
        const user2 = UserInfo.create("ijkl", "IJKL", "http://photo/IJKL.jpg", now);
        const user3 = UserInfo.create("mnop", "MNOP", "http://photo/mnop.jpg", now);

        const expected = List.of(user1, user3);
        const userListAction = new UserListAction(new Dispatcher());
        const userListEvent = userListAction.createProperty();
        userListEvent.skip(4).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        userListAction.push(user1);     // skip2
        userListAction.push(user2);     // skip3
        userListAction.push(user3);     // skip4
        userListAction.delete("ijkl");  // actual
        userListAction.end();
    });
    it("should return empty user list", () => {
        const now = new Date();
        const user1 = UserInfo.create("efgh", "EFGH", "http://photo/efgh.jpg", now);
        const user2 = UserInfo.create("ijkl", "IJKL", "http://photo/IJKL.jpg", now);
        const user3 = UserInfo.create("mnop", "MNOP", "http://photo/mnop.jpg", now);

        const expected = List<UserInfo>();
        const userListAction = new UserListAction(new Dispatcher());
        const userListEvent = userListAction.createProperty();
        userListEvent.skip(4).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        userListAction.push(user1);     // skip2
        userListAction.push(user2);     // skip3
        userListAction.push(user3);     // skip4
        userListAction.clear();  // actual
        userListAction.end();
    });
});

