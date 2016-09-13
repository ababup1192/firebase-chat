import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map} from "immutable";
import {IUserInfo, LoginAction} from "../actionCreators/loginAction";

interface IUserList {
    uid: string;
    displayName: string;
}

interface UsersListProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    loginAction: LoginAction;
    loginEvent: Bacon.Property<IUserInfo, List<IUserInfo>>;

}

interface UsersListState {
    userList: List<IUserList>;
}

export default class UserList extends React.Component<UsersListProps, UsersListState> {
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.state = { userList: List<IUserList>() };
    }


    public componentWillMount() {
        this.isMount = true;

        // ログインユーザリスト更新処理
        this.props.loginEvent.onValue((newUserList: List<IUserInfo>) => {
            if (this.isMount) {
                this.setState({ userList: newUserList });
            }
        });

        // 10秒毎にユーザリストを更新(一旦ログインユーザ斉削除)
        this.props.usersRef.remove();
        setInterval(() => this.props.usersRef.remove(), 10 * 1000);

        // FirebaseからUsersを読み込む(ログインユーザが削除・変更されたとき)
        this.props.usersRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
            const currentUser = Firebase.auth().currentUser;
            // 自分のログイン情報をFirebaseに書き込む
            this.props.usersRef.child(currentUser.uid).once("value", (snapShot) => {
                if (snapShot.val() === null) {
                    this.props.usersRef.child(currentUser.uid).set({
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    });
                }
            });

            if (snapShot.val()) {
                // ログイン情報が全部書き込まれてから(画面のチラつき防止)ユーザリストを更新
                setTimeout(() =>
                    this.props.usersRef.once("value", function (snapShot) {
                        const value = snapShot.val();
                        const users = List(Object.keys(value).map((key, idx) => value[key]));
                        this.props.loginAction.innerLogin(users);
                    }.bind(this)), 2 * 1000);
            }
        });
    }

    public componentWillUnmount() {
        this.isMount = false;
    }

    render() {
        return <ul className="users-list">
            {
                this.state.userList.map((user, idx) =>
                    <li key={`users-${idx}`}>{user.displayName}</li>
                )
            }
        </ul>;
    }
}