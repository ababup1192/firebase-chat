import * as React from "react";
import * as ReactDOM from "react-dom";

export default class NoLoggedInHeader extends React.Component<any, any> {
    constructor() {
        super();
    }

    render() {
        return <div className="siteHeader">
            <div className="siteHeader__section" />
            <div className="siteHeader__section">
                <div className="siteHeader__item siteHeaderButton is-site-header-item-selected">
                    Log in
                </div>
            </div>
        </div>;
    }
}

