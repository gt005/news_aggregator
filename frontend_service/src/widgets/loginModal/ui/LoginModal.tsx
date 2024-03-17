import { FC, useState } from 'react';
import { Button, Form, Input, Alert } from 'antd';
import { loginUser } from '@/features/auth/api/loginUser';
import { setJwtToken } from '@/shared/lib/storage/jwt';
import styles from './LoginModal.module.sass';
import { getCurrentUser, setCurrentUser } from '@/shared/lib/storage/user';
import { fetchCurrentUser } from '@/shared/api/users';
import { useNavigate } from 'react-router-dom';


type LoginFieldType = {
    email: string;
    password: string;
};


export const LoginModal: FC = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const onLoginFinish = async (values: LoginFieldType) => {
        try {
            const JwtToken = await loginUser({
                email: values.email,
                password: values.password
            });
            setJwtToken(JwtToken);
            setCurrentUser(await fetchCurrentUser());
            navigate(`/profile/${getCurrentUser()!.id}`);
        } catch (error) {
            setErrorMessage('Неправильный логин или пароль');
        }
    }

    return (
        <>
            {errorMessage && <Alert className={styles.alertMessage} message={errorMessage} type="error" />}
            <Form
                name="loginForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onLoginFinish}
            >
                <Form.Item<LoginFieldType>
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Введите корректный email',
                        },
                        {
                            required: true,
                            message: 'Введите email'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<LoginFieldType>
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Войти
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};