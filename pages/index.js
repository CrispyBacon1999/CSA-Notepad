import React from "react";
import {
    Avatar,
    Button,
    Card,
    Col,
    Grid,
    List,
    Row,
    Spin,
    Typography,
} from "antd";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import TeamList from "../components/dashboard/TeamList";
import { useUser } from "../context/userContext";
import { currentEventState, teamListState } from "../state";

const { Title, Paragraph } = Typography;

export default function Home() {
    // Our custom hook to get context values
    const { loadingUser, user } = useUser();
    const currentEvent = useRecoilValue(currentEventState);

    useEffect(() => {
        if (!loadingUser) {
            // You know that the user is loaded: either logged in or out!
            console.log(user);
        }
        // You also have your firebase app initialized
    }, [loadingUser, user]);

    return (
        <div>
            <Head>
                <title>CSA Notepad</title>
            </Head>
            <Row>
                <Col>
                    <Title>CSA Notepad</Title>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col xs={24} sm={12} lg={8}>
                    <Card bordered={false} title="Current Event">
                        <Paragraph>
                            {currentEvent === null
                                ? "No event selected"
                                : currentEvent.name}
                        </Paragraph>
                        <Link href="/settings#event_select" passHref>
                            <Button
                                type={
                                    currentEvent === null ? "primary" : "ghost"
                                }
                            >
                                Select event
                            </Button>
                        </Link>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={16}>
                    <Card title="Teams">
                        <React.Suspense fallback={<Spin></Spin>}>
                            <TeamList></TeamList>
                        </React.Suspense>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
