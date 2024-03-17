import { FC, useState } from 'react';
import { Button, Checkbox, Form, Input, Modal, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtpCode } from '@/features/auth/api/otpCode';
import { verifyOtpCode } from '@/features/auth/api/verifyOtpCode';
import { registerUser } from '@/features/auth/api/registerUser';
import { setJwtToken } from '@/shared/lib/storage/jwt';
import styles from './RegistrationModal.module.sass';
import { setCurrentUser } from '@/shared/lib/storage/user';
import { fetchCurrentUser } from '@/shared/api/users';

type RegistrationFieldsType = {
    email: string;
    name: string;
    password: string;
    repeatPassword: string;
    approve: boolean;
};


type OtpCodeFieldsType = {
    otpCode: number;
};


export const RegistrationModal: FC = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [isOtpCodeConfirmationOpen, setIsOtpCodeConfirmationOpen] = useState(false);
    const [errorMessage, setErorrMessage] = useState<string | null>(null);
    const [registrationFormDisabled, setRegistrationFormDisabled] = useState<boolean>(false);
    const [isDocumentApproved, setIsDocumentApproved] = useState<boolean>(false);

    const onRegistrationFinish = async (values: RegistrationFieldsType) => {
        setRegistrationFormDisabled(true);
        try {
            const response = await sendOtpCode(values.email);
            setIsOtpCodeConfirmationOpen(true);
        } catch (error) {
            setErorrMessage('Ошибка при отправке кода подтверждения');
        }
        setRegistrationFormDisabled(false);
    }

    const onOtpCodeFinish = async (otpCode: OtpCodeFieldsType) => {
        const formData = form.getFieldsValue();
        try {
            const authorizationToken = await verifyOtpCode(
                { email: formData.email, code: otpCode.otpCode }
            );
            console.log(authorizationToken);
            const JwtToken = await registerUser(
                {
                    authorizationToken: authorizationToken,
                    email: formData.email,
                    name: formData.name,
                    password: formData.password
                }
            );
            setJwtToken(JwtToken);
            setCurrentUser(await fetchCurrentUser());
            navigate('/');
        } catch (error) {
            setErorrMessage('Неправильный логин или пароль');
        }
    };

    return (
        <>
            {errorMessage && <Alert className={styles.alertMessage} message={errorMessage} type="error" />}
            <Form
                form={form}
                name="registrationForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                className={styles.registrationForm}
                initialValues={{ remember: true }}
                disabled={registrationFormDisabled}
                onFinish={onRegistrationFinish}
            >
                <Form.Item<RegistrationFieldsType>
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Введите корректный email',
                        },
                        {
                            required: true,
                            message: 'Введите email!'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<RegistrationFieldsType>
                    label="Ваше Имя"
                    name="name"
                    rules={[{ required: true, message: 'Введите имя' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<RegistrationFieldsType>
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password />
                </Form.Item>


                <Form.Item<RegistrationFieldsType>
                    label="Повторите пароль"
                    name="repeatPassword"
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                            message: 'Повторите пароль',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Пароли не совпадают'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item<RegistrationFieldsType>
                    name="approve"
                    valuePropName='checked'
                    wrapperCol={{ offset: 8, span: 16 }}
                    rules={[{ required: true, message: 'Подтвердите соглашение' }]}
                >
                    <Checkbox checked={isDocumentApproved} onChange={(e) => setIsDocumentApproved(e.target.checked)}>Соглашаюсь с <Link className={styles.documentsLink} to="https://example.com">Условиями пользования сервисом</Link></Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Зарегистрироваться
                    </Button>
                </Form.Item>
            </Form>

            <Modal title="Подтвердите почту" open={isOtpCodeConfirmationOpen} footer={null} onCancel={() => setIsOtpCodeConfirmationOpen(false)}>
                <p>На вашу почту отправлено письмо с кодом подтверждения</p>
                    

                <Form
                    form={form}
                    name="otpCodeForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onOtpCodeFinish}
                    autoComplete="off"
                >
                    <Form.Item<OtpCodeFieldsType>
                        label="Код подтверждения"
                        name="otpCode"
                        rules={[
                            {
                                required: true,
                                message: 'Введите код подтверждения!',
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Подтвердить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};