import axios from 'axios';
import { Folder } from "@/shared/model/types/folders";
import { serverUrl } from '@/shared/const';
import { getJwtToken } from '@/shared/lib/storage/jwt';
import { FetchNewsListResult } from '@/shared/model/types/news';


export const fetchFolderById = async (folder_id: string): Promise<Folder> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }
    const response = await axios.get(
        `/api/v1/folders/${folder_id}`,
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching user');
    }

    return response.data;
}

export const createFolder = async (title: string): Promise<Folder> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.post(
        `/api/v1/folders/`,
        {
            title: title,
        },
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 201) {
        throw new Error('Error occurred while fetching user');
    }

    return response.data;
}

export const fetchFolderNews = async (folderId: string, page: number): Promise<FetchNewsListResult> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.get(
        `/api/v1/folders/${folderId}/news?page=${page}`,
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching folders');
    }

    return response.data;
}
