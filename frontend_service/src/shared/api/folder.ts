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

export const fetchMyFolders = async (): Promise<Folder[]> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.get(
        `/api/v1/folders/`,
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
        `/api/v1/news/${folderId}/news?page=${page}`,
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


export const addNewsToFolder = async (folderId: string, newsId: string): Promise<void> => {
    const jwtToken = getJwtToken();

    if (!jwtToken) {
        throw new Error('No token found');
    }

    const response = await axios.post(
        `/api/v1/folders/${folderId}/add-news/${newsId}`,
        {
            news_id: newsId,
        },
        {
            baseURL: serverUrl,
            headers: { Authorization: `Bearer ${jwtToken.access_token}` }
        }
    );

    if (response.status !== 204) {
        throw new Error('Error occurred while fetching folders');
    }
}
