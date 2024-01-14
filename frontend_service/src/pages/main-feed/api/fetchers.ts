import axios from 'axios';
import { FetchNewsListResult } from "@/shared/model/types";
import { serverUrl } from '@/shared/const';


export const fetchMainFeedPageNews = async (page: number): Promise<FetchNewsListResult> => {
    const response = await axios.get(`/feed?page=${page}`, {
        baseURL: `http://${serverUrl}`,  // TODO: Replace 'http' with 'https' if necessary
    });

    return response.data;
}