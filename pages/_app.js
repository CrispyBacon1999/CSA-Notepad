import Layout, { Content } from "antd/lib/layout/layout";
import Sidebar from "../components/layout/Sidebar";
import UserProvider from "../context/userContext";
import "antd/dist/antd.css";
import "../style/app.css";
import UserWaitContent from "../components/layout/UserWaitContent";
import { RecoilRoot } from "recoil";

// Custom App to wrap it with context provider
export default function App({ Component, pageProps }) {
    return (
        <RecoilRoot>
            <UserProvider>
                <Layout>
                    <Sidebar />
                    <UserWaitContent>
                        <Component {...pageProps} />
                    </UserWaitContent>
                </Layout>
            </UserProvider>
        </RecoilRoot>
    );
}
