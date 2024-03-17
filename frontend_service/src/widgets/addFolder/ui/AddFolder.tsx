import { createFolder } from "@/shared/api/folder";
import { Button, Form, Input } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";


type AddFolderType = {
    title: string;
};


export const AddFolder: FC = () => {
    const navigate = useNavigate();

    const onFolderCreateFinish = async (values: AddFolderType) => {
        const createdFolder = await createFolder(values.title);
        navigate(`/folder/${createdFolder.id}`);        
    }

    return (
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
    )
}