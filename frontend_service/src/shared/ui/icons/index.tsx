import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faFolderMinus } from '@fortawesome/free-solid-svg-icons'

interface IconProps {
    className?: string;
}

export const AddToFolderIcon = ({ className }: IconProps) => {
    return <FontAwesomeIcon icon={faFolderPlus} className={className} />
}

export const RemoveFromFolderIcon = ({ className }: IconProps) => {
    return <FontAwesomeIcon icon={faFolderMinus} className={className} />
}