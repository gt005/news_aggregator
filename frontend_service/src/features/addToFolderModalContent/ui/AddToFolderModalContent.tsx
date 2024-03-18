import { addNewsToFolder, fetchMyFolders } from "@/shared/api/folder";
import { Folder } from "@/shared/model/types/folders";
import { INews } from "@/shared/model/types/news";
import { Alert, Button, Form, Select, message } from "antd"
import { FC, useEffect, useState } from "react"


interface AddToFolderModalContentProps {
    news: INews;
    setIsAddToFolderModalOpen: (isOpen: boolean) => void;
}

type SelectFolderForm = {
    folder_id: string;
};

export const AddToFolderModalContent: FC<AddToFolderModalContentProps> = ({ news, setIsAddToFolderModalOpen }) => {
    const [form] = Form.useForm();
    const [errorMessage, setErorrMessage] = useState<string | null>(null);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    const onFolderCreateFinish = async () => {
        const formData = form.getFieldsValue();

        try {
            await addNewsToFolder(formData.folder_id, news.id);
            setIsAddToFolderModalOpen(false);
            messageApi.open({
                type: 'success',
                content: 'Успешно добавлено в папку',
            });
        }
        catch (error) {
            setErorrMessage('Ошибка при добавлении новости в папку');
        }
    }

    useEffect(() => {
        fetchMyFolders().then((fetchedFolders) => {
            setFolders(fetchedFolders);
        });
    }, []);

    return (
        <>
            {contextHolder}
            {errorMessage && <Alert message={errorMessage} type="error" />}
            <Form
                form={form}
                name="selectFolderForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFolderCreateFinish}
            >
                <Form.Item<SelectFolderForm>
                    label="Папка"
                    name="folder_id"
                    rules={[
                        {
                            required: true,
                            message: 'Выберите папку'
                        }
                    ]}
                >
                    <Select>
                        {folders.map((folder) => (
                            <Select.Option key={folder.id} value={folder.id}>{folder.title}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Добавить
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}