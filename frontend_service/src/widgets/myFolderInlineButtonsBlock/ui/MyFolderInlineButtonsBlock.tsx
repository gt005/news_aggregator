import { Folder } from "@/shared/model/types/folders"
import { Button, Flex, Modal } from "antd"
import { FC } from "react"
import { useState, useEffect } from 'react';
import { FolderInlineButton } from "@/entities/folderInlineButton";
import { getCurrentUser } from "@/shared/lib/storage/user";
import { User } from "@/shared/model/types/users";
import styles from './MyFolderInlineButtonsBlock.module.sass'
import { AddFolder } from "@/widgets/addFolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { fetchMyFolders } from "@/shared/api/folder";


export const MyFolderInlineButtonsBlock: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [foldersList, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const user = getCurrentUser();
        setUser(user);

        if (!user) {
            return;
        }
        const fetchFolders = async () => {
            setIsLoading(true);
            try {
                const fetchedFolders = await fetchMyFolders();
                setFolders(fetchedFolders);
            } catch (error) {
                setError('An error occurred while fetching the folders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFolders();
    }, []);

    return (
        user ? (
            <>
                <Flex vertical style={{ width: "100%" }}>
                    {(foldersList.length > 0) ? (
                        <>
                            {foldersList.map(folder => (
                                <div key={folder.id} style={{ display: "flex", alignItems: "center" }}>
                                    <FolderInlineButton folder={folder} />
                                    <FontAwesomeIcon icon={faPencil} style={{ marginLeft: "auto", cursor: "pointer" }} />
                                    <FontAwesomeIcon icon={faTrash} style={{ marginLeft: "16px", color: "red", cursor: "pointer" }} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div>У вас пока нет папок</div>
                    )}
                    <Button type="primary" block className={styles.createFolderButton} onClick={() => { setIsCreateModalVisible(true) }}>
                        Создать папку
                    </Button>
                </Flex >
                <Modal title="Создать папку" footer={null} open={isCreateModalVisible} onCancel={() => { setIsCreateModalVisible(false) }}>
                    <AddFolder />
                </Modal>
            </>
        ) : (
            <>Чтобы работать с Папками, войдите в аккаунт.</>
        )
    );
}