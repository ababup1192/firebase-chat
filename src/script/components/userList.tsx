import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Firebase from "firebase";
import {List, Map, Record} from "immutable";

import Dispatcher from "../actionCreators/dispatcher";
import {UserInfoUtil} from "../utils/userInfo";
import {IUserInfo} from "../definition/definitions";
import {UserListAction} from "../actionCreators/userListAction";

interface UsersListProps {
    uid: string;
    usersRef: Firebase.database.Reference;
    loginStatusRef: Firebase.database.Reference;
    userListAction: UserListAction;
}

interface UsersListState {
    loginStatusList: List<IUserInfo>;
    selectedUserList: List<string>;
}

export default class UserList extends React.Component<UsersListProps, UsersListState> {
    private isMount: boolean;

    constructor(props) {
        super(props);

        this.isMount = false;
        this.state = { loginStatusList: List<IUserInfo>(), selectedUserList: List<string>() };
    }

    public componentDidMount() {
        this.isMount = true;
        this.props.loginStatusRef.on("value", (snapShot: Firebase.database.DataSnapshot) => {
            if (this.isMount) {
                const loginStatusList = UserInfoUtil.toUserInfoList(snapShot.val());
                this.setState({
                    loginStatusList: loginStatusList,
                    selectedUserList: this.state.selectedUserList
                });
            }
        });
    }

    public componentWillUnmount() {
        this.isMount = false;
    }

    private handleClickList(e: MouseEvent) {
        this.setState({ loginStatusList: this.state.loginStatusList, selectedUserList: List<string>() });
        this.props.userListAction.clear();
    }

    private handleClickItem(clickedUserInfo: IUserInfo, e: MouseEvent) {
        if (this.state.selectedUserList.contains(clickedUserInfo.uid)) {
            const selectedUserList: List<string> = this.state.selectedUserList.
                filterNot((uid) => uid === clickedUserInfo.uid).toList();
            this.setState({ loginStatusList: this.state.loginStatusList, selectedUserList: selectedUserList });
            this.props.userListAction.delete(clickedUserInfo.uid);
        } else {
            const selectedUserList: List<string> = this.state.selectedUserList.push(clickedUserInfo.uid);
            this.setState({ loginStatusList: this.state.loginStatusList, selectedUserList: selectedUserList });
            this.props.userListAction.push(clickedUserInfo);
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
                this.state.loginStatusList.map((user, idx) =>
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