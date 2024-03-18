import { Folder } from "@/shared/model/types/folders"
import { FC } from "react"
import { Link } from "react-router-dom"
import styles from './FolderInlineButton.module.sass'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import { DeleteFolderButton } from "@/features/deleteFolderButton"

interface FolderInlineButtonProps {
    folder: Folder
}


export const FolderInlineButton: FC<FolderInlineButtonProps> = ({ folder }) => {
    return (
        <>
            <Link className={styles.container} to={`/folder/${folder.id}`}>
                <div className={styles.title}>{folder.title}</div>
            </Link>
            <FontAwesomeIcon icon={faPencil} style={{ marginLeft: "auto", cursor: "pointer" }} />
            <DeleteFolderButton folder={folder} />
        </>
    )
}
