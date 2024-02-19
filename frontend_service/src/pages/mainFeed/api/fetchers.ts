import axios from 'axios';
import { FetchNewsListResult } from "@/shared/model/types";
import { serverUrl } from '@/shared/const';


export const fetchMainFeedPageNews = async (page: number): Promise<FetchNewsListResult> => {
    const response = await axios.get(`/api/v1/news/?page=${page}`, {
        baseURL: serverUrl
    });

    if (response.status !== 200) {
        throw new Error('Failed to fetch news');
    }
    console.log("data:", response.data);

    return response.data;
}