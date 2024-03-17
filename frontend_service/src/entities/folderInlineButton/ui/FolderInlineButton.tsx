import { Folder } from "@/shared/model/types/folders"
import { FC } from "react"
import { Link } from "react-router-dom"
import styles from './FolderInlineButton.module.sass'

interface FolderInlineButtonProps {
    folder: Folder
}


export const FolderInlineButton: FC<FolderInlineButtonProps> = ({ folder }) => {
    return (
        <Link className={styles.container} to={`/folder/${folder.id}`}>
            <div className={styles.title}>{folder.name}</div>
        </Link>
    )
}
