import {List, Record} from "immutable";
import {HeaderInfo} from "../../src/script/definitions/headerInfo";
import Dispatcher from "../../src/script/actionCreators/dispatcher";
import {HeaderAction} from "../../src/script/actionCreators/headerAction";

describe("HeaderAction", () => {
    it("should return initial value", () => {
        const expected = HeaderInfo.create(false, "Log In");
        const headerAction = new HeaderAction(new Dispatcher());
        const headerEvent = headerAction.createProperty();
        headerEvent.onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
    });
    it("should return login value", () => {
        const expected = HeaderInfo.login();
        const headerAction = new HeaderAction(new Dispatcher());
        const headerEvent = headerAction.createProperty();
        headerEvent.skip(1).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        headerAction.login();
    });
    it("should return Settings Item", () => {
        const expected = HeaderInfo.create(true, "Settings");
        const headerAction = new HeaderAction(new Dispatcher());
        const headerEvent = headerAction.createProperty();
        headerEvent.skip(2).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        headerAction.login();
        headerAction.changeItem("Settings");
    });
    it("should return logout value", () => {
        const expected = HeaderInfo.logout();
        const headerAction = new HeaderAction(new Dispatcher());
        const headerEvent = headerAction.createProperty();
        headerEvent.skip(2).onValue((actual) =>
            chai.assert.isTrue(expected.equals(actual))
        );
        headerAction.login();
        headerAction.logout();
    });
});

