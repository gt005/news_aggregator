import axios from 'axios';
import { Folder } from "@/shared/model/types/folders";
import { FetchNewsListResult } from '@/shared/model/types/news';
import { serverUrl } from '@/shared/const';


export const fetchFolderNews = async (folderId: string, page: number): Promise<FetchNewsListResult> => {
    const response = await axios.get(
        `/api/v1/folders/${folderId}/news?page=${page}`,
        { baseURL: serverUrl }
    );

    return response.data;
}
