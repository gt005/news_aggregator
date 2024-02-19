import { Folder } from "@/shared/model/types"
import { Flex } from "antd"
import { FC } from "react"
import { fetchMyFolders } from "../api/fetchers";
import { useState, useEffect } from 'react';
import { FolderInlineButton } from "@/entities/folderInlineButton";


export const MyFolderInlineButtonsBlock: FC = () => {
    const [foldersList, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
        <Flex vertical>
            <>{foldersList.map(folder => (
                <FolderInlineButton key={folder.id} folder={folder} />
            ))}</>
        </Flex>
    )
}