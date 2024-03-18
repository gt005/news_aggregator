import { useState, type FC } from "react";

import { INews } from "@/shared/model/types/news";
import styles from '@/shared/ui/styles/corner-buttons/cornerButton.module.sass'
import { RemoveFromFolderIcon } from "@/shared/ui/icons";
import { Modal } from "antd";
import { Folder } from "@/shared/model/types/folders";
import { RemoveFromFolderModalContent } from "@/features/removeFromFolderModalContent";

interface RemoveFromFolderButtonProps {
    news: INews;
    folder: Folder | null;
}

export const RemoveFromFolderButton: FC<RemoveFromFolderButtonProps> = ({ news, folder }) => {
    const [isAddToFolderModalOpen, setIsAddToFolderModalOpen] = useState(false);

    const callback = () => {
        window.location.reload()
    }

    return (
        <>
            <button onClick={() => { setIsAddToFolderModalOpen(true) }} className={styles.container}>
                <RemoveFromFolderIcon className={styles.icon} />
            </button>
            <Modal title="Удалить новость из папки?" open={isAddToFolderModalOpen} footer={null} onCancel={() => setIsAddToFolderModalOpen(false)}>
                <RemoveFromFolderModalContent folder={folder} news={news} callback={callback} />
            </Modal>
        </>
    )
}