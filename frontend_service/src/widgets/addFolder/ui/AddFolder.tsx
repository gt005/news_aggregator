import { createFolder } from "@/shared/api/folder";
import { Alert, Button, Form, Input } from "antd";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AddFolder.module.sass';


type AddFolderType = {
    title: string;
};


export const AddFolder: FC = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onFolderCreateFinish = async (values: AddFolderType) => {
        try {
            const createdFolder = await createFolder(values.title);
            navigate(`/folder/${createdFolder.id}`);
        } catch (error) {
            setErrorMessage('Папка с таким названием уже существует');
        }
    }

    return (
        <>
            {errorMessage && <Alert className={styles.alertMessage} message={errorMessage} type="error" />}
            <Form
                name="createFolderForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFolderCreateFinish}
            >
                <Form.Item<AddFolderType>
                    label="Название"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Введите название'
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Создать
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}