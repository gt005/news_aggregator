import { type FC } from "react";

import { INews } from "@/shared/types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import styles from './AddToFolderButton.module.sass'

interface AddToFolderButtonProps {
    news: INews;
}

export const AddToFolderButton: FC<AddToFolderButtonProps> = ({ news }) => {
    return (
        <button onClick={() => { alert('hello') }} className={styles.container}>
            <FontAwesomeIcon icon={faFolderPlus} className={styles.icon} />
        </button>
    )
}