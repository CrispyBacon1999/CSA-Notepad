import React from "react";
import {
    DashboardOutlined,
    RobotOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/lib/layout/Sider";
import Link from "next/link";

export default function Sidebar() {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed, type) => {
                console.log("Collapsed");
                setCollapsed(collapsed);
            }}
        >
            <Menu theme="dark" mode="inline">
                <Menu.Item key="0" icon={<DashboardOutlined />}>
                    <Link href="/">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="1" icon={<UserOutlined />}>
                    <Link href="/settings">User Settings</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<RobotOutlined />}>
                    <Link href="/teams">Teams</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
