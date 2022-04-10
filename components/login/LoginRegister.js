import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import Head from "next/head";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";

export default function LoginRegister() {
    const [isLogin, setIsLogin] = React.useState(true);

    const onLogin = (values) => {
        console.log("Received values of form: ", values);
        const auth = getAuth();
        setPersistence(
            auth,
            values.remember
                ? browserLocalPersistence
                : browserSessionPersistence
        ).then(() => {
            signInWithEmailAndPassword(auth, values.email, values.password)
                .then((user) => {
                    console.log("Logged in", user);
                })
                .catch((error) => {
                    console.log("Error logging in", error);
                });
        });
    };

    const onRegister = (values) => {
        console.log("Received values of form: ", values);
        const auth = getAuth();
        setPersistence(
            auth,
            values.remember
                ? browserLocalPersistence
                : browserSessionPersistence
        ).then(() => {
            createUserWithEmailAndPassword(auth, values.email, values.password)
                .then((user) => {
                    console.log("Registered", user);
                })
                .catch((error) => {
                    console.log("Error registering", error);
                });
        });
    };

    if (isLogin) {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onLogin}
            >
                <Head>
                    <title>CSA Notepad - Login</title>
                </Head>
                <h1>Login</h1>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email!" },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                    >
                        Log in
                    </Button>
                    Or{" "}
                    <a
                        href="#"
                        onClick={() => {
                            setIsLogin(false);
                        }}
                    >
                        register now!
                    </a>
                </Form.Item>
            </Form>
        );
    } else {
        return (
            <Form
                name="normal_register"
                className="register-form"
                initialValues={{ remember: true }}
                onFinish={onRegister}
            >
                <Head>
                    <title>CSA Notepad - Register</title>
                </Head>
                <h1>Register</h1>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email!" },
                    ]}
                >
                    <Input
                        prefix={
                            <UserOutlined className="site-form-item-icon" />
                        }
                        placeholder="Email"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your Password!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item
                    name="confirm_password"
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your Password!",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Confirm Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="register-form-button"
                    >
                        Register
                    </Button>
                    Or{" "}
                    <a
                        href="#"
                        onClick={() => {
                            setIsLogin(true);
                        }}
                    >
                        login!
                    </a>
                </Form.Item>
            </Form>
        );
    }
}
