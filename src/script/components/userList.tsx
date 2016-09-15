import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map, Record} from "immutable";
import {IUserInfo, TwitterLoginAction} from "../actionCreators/twitterLoginAction";
import {IUidWithName, UserListAction} from "../actionCreators/userListAction";
import Dispatcher from "../actionCreators/dispatcher";

interface UsersListProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    userListAction: UserListAction;
}

interface UsersListState {
    userList: List<IUserInfo>;
    selectedUserList: List<string>;
}

export default class UserList extends React.Component<UsersListProps, UsersListState> {
    twitterLoginAction: TwitterLoginAction;
    twitterLoginEvent: Bacon.Property<IUserInfo, List<IUserInfo>>;
    private removeUsersTimer;
    private updateUserTimer;
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.twitterLoginAction = new TwitterLoginAction(new Dispatcher(), this.props.usersRef);
        this.twitterLoginEvent = this.twitterLoginAction.createProperty();
        this.isMount = false;
        this.state = { userList: List<IUserInfo>(), selectedUserList: List<string>() };
    }

    // ログインユーザリストを状態に反映(イベント更新を待ち受ける)
    private updateStateUserList() {
        this.twitterLoginEvent.onValue((newUserList: List<IUserInfo>) =>
            // ComponentがUnmountされたら状態の反映をストップ
            this.setState({ userList: newUserList, selectedUserList: this.state.selectedUserList })
        );
    }

    // 20秒間隔でログインユーザリストを削除
    private removeUserListRepetedly() {
        this.props.usersRef.remove();
        this.removeUsersTimer = setInterval(() =>
            this.props.usersRef.remove()
            , 20 * 1000);
    }

    // Firebaseに現在のログインユーザ情報を保存
    private saveCurrentUserInfo(user: IUserInfo) {
        if (user && this.isMount) {
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
    }

    // 更新されたユーザリストをイベントに伝搬(ユーザリストが完全に更新されるまで、二秒待つ)
    private notifyUpdatedUserList() {
        this.updateUserTimer = setTimeout(() =>
            this.props.usersRef.once("value", function (snapShot) {
                const userListObject = snapShot.val();
                if (userListObject) {
                    const users = List(Object.keys(userListObject).map((key) => userListObject[key]));
                    const usersList = users.filter((user) => user.uid === this.props.uid).concat(
                        users.filterNot((user) => user.uid === this.props.uid)
                    );
                    this.twitterLoginAction.innerLogin(usersList);
                }
            }.bind(this))
            , 2 * 1000);
    }

    // 10秒間隔でログインユーザリストを更新
    private refleshUserList() {
        this.props.usersRef.child(this.props.uid).once("value", (snapShot) => {
            // 更新前のユーザ情報を確保。
            const user = snapShot.val();
            this.updateStateUserList();
            this.removeUserListRepetedly();

            // FirebaseからUsersを読み込む(ログインユーザが削除・変更されたとき)
            this.props.usersRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
                // 確保しておいたユーザ情報を保存。
                this.saveCurrentUserInfo(user);

                // 更新された情報が空出なければ、更新情報をイベントに伝搬
                if (snapShot.val()) {
                    this.notifyUpdatedUserList();
                }
            });
        });
    }

    public componentWillMount() {
        this.isMount = true;
        this.refleshUserList();
    }

    public componentWillUnmount() {
        this.isMount = false;
        this.twitterLoginAction.end();
        if (this.removeUsersTimer) { clearInterval(this.removeUsersTimer); }
        if (this.updateUserTimer) { clearInterval(this.updateUserTimer); }
    }

    private handleClickList(e: MouseEvent) {
        this.setState({ userList: this.state.userList, selectedUserList: List<string>() });
        this.props.userListAction.clear();
    }

    private handleClickItem(clickedUidWithName: IUidWithName, e: MouseEvent) {
        if (this.state.selectedUserList.contains(clickedUidWithName.uid)) {
            const selectedUserList: List<string> = this.state.selectedUserList.
                filterNot((uid) => uid === clickedUidWithName.uid).toList();
            this.setState({ userList: this.state.userList, selectedUserList: selectedUserList });
            this.props.userListAction.delete(clickedUidWithName.uid);
        } else {
            const selectedUserList: List<string> = this.state.selectedUserList.push(clickedUidWithName.uid);
            this.setState({ userList: this.state.userList, selectedUserList: selectedUserList });
            this.props.userListAction.push(clickedUidWithName);
        }
        e.stopPropagation();
    }

    render() {
        const userClass = (uid: string) => this.state.selectedUserList.contains(uid) ?
            "selected" : "";
        return <ul className="users-list"
            onClick={this.handleClickList.bind(this) }
            >
            {
                this.state.userList.map((user, idx) =>
                    <li
                        key={`users-${idx}`}
                        onClick={this.handleClickItem.bind(this, user) }
                        >
                        <div className={`userinfo ${userClass(user.uid)}`}>
                            <img src={ user.photoURL } />
                            <p>{user.displayName}</p>
                        </div>
                    </li>
                )
            }
        </ul>;
    }
}