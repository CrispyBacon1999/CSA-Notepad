import { CalendarOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography } from "antd";
import clsx from "clsx";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { useUser } from "../../context/userContext";
import { currentEventState } from "../../state";

export default function EventSelect(props) {
    const [currentEvent, setEvent] = useRecoilState(currentEventState);

    const { loadingUser, user } = useUser();

    const onSubmit = async (values) => {
        console.log("Received values of form: ", values);
        const event = await fetch(`/api/tba/event/${values.eventKey}`).then(
            (res) => res.json()
        );
        const firestore = getFirestore();
        const userDoc = await doc(firestore, `users/${user.uid}`);
        await updateDoc(userDoc, {
            currentEvent: event.key,
        });
        setEvent(event);
    };

    return (
        <Card
            className={clsx({ "guided-focus": props.focused })}
            title="Event Selection"
        >
            <div>
                <Typography.Paragraph>
                    Current Event:{" "}
                    {currentEvent === null ? "None" : currentEvent.key}
                </Typography.Paragraph>
            </div>
            <Form onFinish={onSubmit}>
                <Form.Item name="eventKey">
                    <Input
                        prefix={
                            <CalendarOutlined className="site-form-item-icon" />
                        }
                        placeholder="Event Key"
                    ></Input>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="event-select-button"
                    >
                        Choose Event
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
