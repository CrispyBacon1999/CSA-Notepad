import { Avatar, Badge, Button, List } from "antd";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { teamListState } from "../../state";

export default function TeamList() {
    const teamList = useRecoilValue(teamListState);
    return (
        <List
            itemLayout="horizontal"
            dataSource={teamList}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <Badge count={4}>
                            <Link href={`/team/${item.key}/issues`} passHref>
                                <Button type="primary">Issues</Button>
                            </Link>
                        </Badge>,
                    ]}
                >
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                src={
                                    item.avatar
                                        ? `data:image/png;base64,${item.avatar.details.base64Image}`
                                        : undefined
                                }
                            />
                        }
                        title={item.team_number}
                        description={item.nickname}
                    />
                </List.Item>
            )}
        ></List>
    );
}
