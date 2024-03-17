import { Folder } from "@/shared/model/types/folders"
import { NewsActionType } from "@/shared/model/types/news"
import { Feed } from '@/widgets/feed'
import Title from "@/shared/ui/Title"
import { FC, useEffect, useState } from "react"
import { Layout } from 'antd';
import { fetchFolderNews } from "../api/fetchers";
import { useParams } from "react-router-dom";
import { fetchFolderById } from "@/shared/api/folder";
import { NavigationSider } from "@/widgets/navigationSider";


const { Sider, Content } = Layout;


export const FolderPage: FC = () => {
    const { folderId } = useParams()

    const [folder, setFolder] = useState<Folder | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFolder = async () => {
            if (!folderId) return;
            setLoading(true);
            try {
                const fetchedFolder = await fetchFolderById(folderId);
                setFolder(fetchedFolder);
                setLoading(false);
            } catch (err: unknown) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        loadFolder();
    }, [folderId]);

    if (loading) return <></>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!folder) return <div>Папка не найдена</div>;  // TODO: сделать красивую страницу 404

    return (
        <>
            <Title title={`Папка ${folder!.name}`} />
            <Layout hasSider>
                <NavigationSider />
                <Content>
                    <Feed newsActionType={NewsActionType.REMOVE} fetchNews={fetchFolderNews.bind(null, folder!.id)} />
                </Content>
            </Layout>
        </>
    )
}
