import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";

import { HeaderAction } from "../actionCreators/headerAction";

interface LoggedInHeaderProps {
    usersRef: Firebase.database.Reference;
    photoURL: string;
    headerAction: HeaderAction;
}

interface LoggedInHeaderState {
    selectedItem: string;
}

export default class LoggedInHeader extends React.Component<LoggedInHeaderProps, LoggedInHeaderState> {
    constructor(props) {
        super(props);

        this.state = { selectedItem: "Main" };
    }

    private selectedItemClass(itemName: string): string {
        return itemName === this.state.selectedItem ? "is-site-header-item-selected" : "";
    }

    private handleClick(selectedItem: string) {
        this.props.headerAction.changeItem({ isLogin: true, selectedItem: selectedItem });
        this.setState({ selectedItem: selectedItem });
    }

    private handleClickLogout() {
        if (confirm("ログアウトして、よろしいですか？")) {
            this.props.usersRef.child(Firebase.auth().currentUser.uid).remove();
            Firebase.auth().signOut().then(() => { }
                , function (error) {
                    console.error(error);
                });
            this.props.headerAction.changeItem({ isLogin: false, selectedItem: "Log in" });
        }
    }

    render() {
        const MAIN_CLASS = `siteHeader__item siteHeaderButton ${this.selectedItemClass("Main")}`;
        const SETTINGS_CLASS = `siteHeader__item siteHeaderButton ${this.selectedItemClass("Settings")}`;

        return <div className="siteHeader">
            <div className="siteHeader__section">
                <div
                    className={MAIN_CLASS}
                    onClick={ this.handleClick.bind(this, "Main") }>
                    Main</div>
            </div>
            <div className="siteHeader__section">
                <div
                    className={SETTINGS_CLASS}
                    onClick={ this.handleClick.bind(this, "Settings") }
                    >Settings</div>
                <div className="siteHeader__item siteHeaderButton">
                    <img src={ this.props.photoURL }
                        className="siteHeader__item siteHeaderButton"
                        onClick={ this.handleClickLogout.bind(this) } />
                </div>
            </div>
        </div>;
    }
}