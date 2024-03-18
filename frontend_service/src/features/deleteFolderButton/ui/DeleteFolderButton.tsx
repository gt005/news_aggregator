import { Folder } from "@/shared/model/types/folders";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form, Modal, message } from "antd";
import { FC, useState } from "react";
import styles from './DeleteFolderButton.module.sass';
import { deleteFolder } from "@/shared/api/folder";
import { useNavigate } from "react-router-dom";


interface DeleteFolderButtonProps {
    folder: Folder;
}

export const DeleteFolderButton: FC<DeleteFolderButtonProps> = ({ folder }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isFolderDeleteButtonDisabled, setIsFolderDeleteButtonDisabled] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [errorMessage, setErorrMessage] = useState<string | null>(null);

    const onFolderDeleteFinish = async () => {
        try {
            setIsFolderDeleteButtonDisabled(true);
            await deleteFolder(folder.id);
            messageApi.open({
                type: 'success',
                content: 'Папка успешно удалена',
            });

            setTimeout(() => {
                if (location.pathname === '/') {
                    window.location.reload();
                } else {
                    navigate('/');
                }
            }, 1300);
            
        }
        catch (error) {
            setErorrMessage('Ошибка удаления папки');
            setIsFolderDeleteButtonDisabled(false);
        }
    }

    return (
        <>
            {contextHolder}
            {errorMessage && <Alert className={styles.alertMessage} type="error" message={errorMessage} />}
            <FontAwesomeIcon onClick={() => setIsDeleteModalOpen(true)} icon={faTrash} style={{ marginLeft: "16px", color: "red", cursor: "pointer" }} />

            <Modal title={`Удалить папку "${folder.title}"?`} open={isDeleteModalOpen} footer={null} onCancel={() => setIsDeleteModalOpen(false)}>
                <Form
                    name="selectFolderForm"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFolderDeleteFinish}
                >
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }} className={styles.removeButton}>
                        <Button danger type="primary" htmlType="submit" disabled={isFolderDeleteButtonDisabled}>
                            Удалить
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}