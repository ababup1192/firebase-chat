import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map, Record} from "immutable";
import {IUserInfo, TwitterLoginAction} from "../actionCreators/twitterLoginAction";

interface UsersListProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    twitterLoginAction: TwitterLoginAction;
    twitterLoginEvent: Bacon.Property<IUserInfo, List<IUserInfo>>;
}

interface UsersListState {
    userList: List<IUserInfo>;
}

export default class UserList extends React.Component<UsersListProps, UsersListState> {
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.state = { userList: List<IUserInfo>() };
    }

    // ログインユーザリストを状態に反映(イベント更新を待ち受ける)
    private updateStateUserList() {
        this.props.twitterLoginEvent.onValue((newUserList: List<IUserInfo>) => {
            // ComponentがUnmountされたら状態の反映をストップ
            if (this.isMount) {
                this.setState({ userList: newUserList });
            }
        });
    }

    // 10秒間隔でログインユーザリストを削除
    private removeUserListRepetedly() {
        this.props.usersRef.remove();
        setInterval(() => {
            if (this.isMount) {
                this.props.usersRef.remove();
            }
        }, 10 * 1000);
    }

    // Firebaseに現在のログインユーザ情報を保存
    private saveCurrentUserInfo(user: IUserInfo) {
        if (user) {
            this.props.usersRef.child(user.uid).once("value", (snapShot) => {
                if (snapShot.val() === null && this.isMount) {
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
        setTimeout(() => {
            if (this.isMount) {
                this.props.usersRef.once("value", function (snapShot) {
                    const userListObject = snapShot.val();
                    if (userListObject) {
                        const users = List(Object.keys(userListObject).map((key) => userListObject[key]));
                        this.props.twitterLoginAction.innerLogin(users);
                    }
                }.bind(this));
            }
        }
            , 2 * 1000);
    }

    // 10秒間隔でログインユーザリストを更新
    private refleshUserList() {
        this.props.usersRef.child(this.props.uid).once("value", (snapShot) => {
            const user = snapShot.val();
            this.updateStateUserList();
            this.removeUserListRepetedly();

            // FirebaseからUsersを読み込む(ログインユーザが削除・変更されたとき)
            this.props.usersRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
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
    }

    render() {
        return <ul className="users-list">
            {
                this.state.userList.map((user, idx) =>
                    <li key={`users-${idx}`}>
                        <div className="userinfo">
                            <img src={ user.photoURL } />
                            <p>{user.displayName}</p>
                        </div>
                    </li>
                )
            }
        </ul>;
    }
}