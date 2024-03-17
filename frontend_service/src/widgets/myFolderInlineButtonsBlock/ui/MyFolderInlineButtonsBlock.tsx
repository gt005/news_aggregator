import { Folder } from "@/shared/model/types/folders"
import { Flex } from "antd"
import { FC } from "react"
import { fetchMyFolders } from "../api/fetchers";
import { useState, useEffect } from 'react';
import { FolderInlineButton } from "@/entities/folderInlineButton";
import { getCurrentUser } from "@/shared/lib/storage/user";
import { User } from "@/shared/model/types/users";


export const MyFolderInlineButtonsBlock: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [foldersList, setFolders] = useState<Folder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


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
            <Flex vertical>
                <>
                    {foldersList.map(folder => (
                        <FolderInlineButton key={folder.id} folder={folder} />
                    ))}
                </>
            </Flex >
        ) : (
            <>Чтобы работать с Папками, войдите в аккаунт.</>
        )
    );
}