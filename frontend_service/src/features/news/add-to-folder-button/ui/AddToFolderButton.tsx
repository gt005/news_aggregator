import { useState, type FC } from "react";

import { INews } from "@/shared/model/types/news";
import styles from '@/shared/ui/styles/corner-buttons/cornerButton.module.sass'
import { AddToFolderIcon } from "@/shared/ui/icons";
import { Modal } from "antd";
import { AddToFolderModalContent } from "@/features/addToFolderModalContent";
import { Folder } from "@/shared/model/types/folders";

interface AddToFolderButtonProps {
    news: INews;
    folder: Folder | null;
}

export const AddToFolderCornerButton: FC<AddToFolderButtonProps> = ({ news, folder }) => {
    const [isAddToFolderModalOpen, setIsAddToFolderModalOpen] = useState(false);

    return (
        <>
            <button onClick={() => { setIsAddToFolderModalOpen(true) }} className={styles.container}>
                <AddToFolderIcon className={styles.icon} />
            </button>
            <Modal title="Выберите папку" open={isAddToFolderModalOpen} footer={null} onCancel={() => setIsAddToFolderModalOpen(false)}>
                <AddToFolderModalContent news={news} setIsAddToFolderModalOpen={setIsAddToFolderModalOpen} />
            </Modal>
        </>
    )
}