import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map, Record} from "immutable";
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

    // ログインユーザリストを状態に反映(イベント更新を待ち受ける)
    private updateStateUserList() {
        this.props.loginEvent.onValue((newUserList: List<IUserInfo>) => {
            // ComponentがUnmountされたら状態の反映をストップ
            if (this.isMount) {
                this.setState({ userList: newUserList });
            }
        });
    }

    // 10秒間隔でログインユーザリストを削除
    private removeUserListRepetedly() {
        this.props.usersRef.remove();
        setInterval(() => this.props.usersRef.remove(), 10 * 1000);
    }

    // Firebaseに現在のログインユーザ情報を保存
    private saveCurrentUserInfo(user: Firebase.User) {
        this.props.usersRef.child(user.uid).once("value", (snapShot) => {
            if (snapShot.val() === null) {
                this.props.usersRef.child(user.uid).set({
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });
            }
        });
    }

    // 更新されたユーザリストをイベントに伝搬(ユーザリストが完全に更新されるまで、二秒待つ)
    private notifyUpdatedUserList() {
        setTimeout(() =>
            this.props.usersRef.once("value", function (snapShot) {
                const userListObject = snapShot.val();
                if (userListObject) {
                    const users = List(Object.keys(userListObject).map((key) => userListObject[key]));
                    this.props.loginAction.innerLogin(users);
                }
            }.bind(this))
            , 2 * 1000);
    }

    // 10秒間隔でログインユーザリストを更新
    private refleshUserList() {
        const currentUser = Firebase.auth().currentUser;
        if (currentUser) {
            this.updateStateUserList();
            this.removeUserListRepetedly();

            // FirebaseからUsersを読み込む(ログインユーザが削除・変更されたとき)
            this.props.usersRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
                this.saveCurrentUserInfo(currentUser);

                // 更新された情報が空出なければ、更新情報をイベントに伝搬
                if (snapShot.val()) {
                    this.notifyUpdatedUserList();
                }
            });
        }
    }

    public componentWillMount() {
        this.isMount = true;

        this.refleshUserList();
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