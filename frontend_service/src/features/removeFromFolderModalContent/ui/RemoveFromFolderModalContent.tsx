import { INews } from "@/shared/model/types/news";
import { Alert, Button, Form, message } from "antd";
import { FC, useState } from "react";
import styles from './RemoveFromFolderModalContent.module.sass';
import { Folder } from "@/shared/model/types/folders";
import { removeNewsFromFolder } from "@/shared/api/folder";


interface RemoveFromFolderModalContentProps {
    folder: Folder | null;
    news: INews;
    callback: () => void;
}

export const RemoveFromFolderModalContent: FC<RemoveFromFolderModalContentProps> = ({ folder, news, callback }) => {
    const [errorMessage, setErorrMessage] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [isRemoveButtonDisabled, setIsRemoveButtonDisabled] = useState(false);

    
    if (!folder) {
        return null;
    }

    const onFolderRemoveFinish = async () => {
        try {
            setIsRemoveButtonDisabled(true);
            await removeNewsFromFolder(folder!.id, news.id);
            messageApi.open({
                type: 'success',
                content: 'Успешно удалено из папки',
            });

            setTimeout(() => {
                callback();
            }, 700);
        }
        catch (error) {
            setErorrMessage('Ошибка удаления из папки');
            setIsRemoveButtonDisabled(false);
        }
    }

    return (
        <>
            {contextHolder}
            {errorMessage && <Alert className={styles.alertMessage} type="error" message={errorMessage} />}
            <Form
                name="selectFolderForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFolderRemoveFinish}
            >
                <Form.Item wrapperCol={{ offset: 8, span: 16 }} className={styles.removeButton}>
                    <Button danger type="primary" htmlType="submit" disabled={isRemoveButtonDisabled}>
                        Удалить
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}