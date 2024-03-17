import { type FC } from "react";

import { INews } from "@/shared/model/types/news";
import styles from '@/shared/ui/styles/corner-buttons/cornerButton.module.sass'
import { AddToFolderIcon } from "@/shared/ui/icons";

interface AddToFolderButtonProps {
    news: INews;
}

export const AddToFolderCornerButton: FC<AddToFolderButtonProps> = ({ news }) => {
    return (
        <button onClick={() => { alert('Add') }} className={styles.container}>
            <AddToFolderIcon className={styles.icon} />
        </button>
    )
}