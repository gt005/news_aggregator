import axios from 'axios';
import { FetchNewsListResult, Folder } from "@/shared/model/types";
import { serverUrl } from '@/shared/const';


export const fetchFolderNews = async (folderId: string, page: number): Promise<FetchNewsListResult> => {
    const response = await axios.get(
        `/folder/${folderId}/news?page=${page}`,
        { baseURL: serverUrl }
    );

    return response.data;
}
