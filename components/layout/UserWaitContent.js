import { Spin } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useRouter } from "next/router";
import { useUser } from "../../context/userContext";
import LoginRegister from "../login/LoginRegister";

export default function UserWaitContent(props) {
    const { user, loadingUser } = useUser();
    return (
        <Content className="main-content">
            {loadingUser ? (
                <Spin size="large"></Spin>
            ) : user ? (
                props.children
            ) : (
                <LoginRegister></LoginRegister>
            )}
        </Content>
    );
}
