// import Style Sheet
import "../style/main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";

import App from "./components/app.tsx";

const appNode = document.getElementById("content");

const firebaseConfig = {
    apiKey: "AIzaSyBP9yQTAUGxbq75j4qsBBc_IpYaswIw49M",
    authDomain: "fir-chat-d38c8.firebaseapp.com",
    databaseURL: "https://fir-chat-d38c8.firebaseio.com",
    storageBucket: "fir-chat-d38c8.appspot.com",
};
Firebase.initializeApp(firebaseConfig);

/*
window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.returnValue = "ページから移動しますか？";
};
*/

ReactDOM.render(<App/>, appNode);
