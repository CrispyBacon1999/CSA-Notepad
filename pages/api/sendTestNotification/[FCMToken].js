import { getMessaging } from "firebase-admin";
import admin from "../../../firebase/nodeApp";

export default function testNotificationHandler(req, res) {
    const { FCMToken } = req.query;
    const message = {
        data: {
            team: "254",
            issue: "They broke",
        },
        token: FCMToken,
    };
    admin
        .messaging()
        .send(message)
        .then((response) => {
            res.status(200).json({ message: "Test notification sent" });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
}
