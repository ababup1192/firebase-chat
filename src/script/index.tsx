// import Style Sheet
import "../style/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

// import main typescript
import App from "./components/app.tsx";

const appNode = document.getElementById("content");

const input = (user?) => {
    if (user === "" || user === undefined) {
        input(window.prompt("ユーザー名を入力してください", ""));
    } else {
        ReactDOM.render(<App user={user}/>, appNode);
    }
};

input();