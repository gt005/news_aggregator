import { type FC } from "react";

import { INews } from "@/shared/types";
import styles from '@/shared/ui/styles/corner-buttons/cornerButton.module.sass'
import { RemoveFromFolderIcon } from "@/shared/ui/icons";

interface RemoveFromFolderButtonProps {
    news: INews;
}

export const RemoveFromFolderButton: FC<RemoveFromFolderButtonProps> = ({ news }) => {
    return (
        <button onClick={() => { alert('Remove') }} className={styles.container}>
            <RemoveFromFolderIcon className={styles.icon} />
        </button>
    )
}