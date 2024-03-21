import axios from 'axios';
import { FetchNewsListResult, INewsApiSchema } from "@/shared/model/types/news";
import { serverUrl } from '@/shared/const';
import { convertUTCToMoscowTimeString } from '@/shared/lib/time-utils';


export const fetchMainFeedPageNews = async (page: number): Promise<FetchNewsListResult> => {
    const response = await axios.get(`/api/v1/news/?page=${page}`, {
        baseURL: serverUrl
    });

    if (response.status !== 200) {
        throw new Error('Failed to fetch news');
    }

    const modifiedItems = response.data.items.map((newsItem: INewsApiSchema) => ({
        ...newsItem,
        published_at: convertUTCToMoscowTimeString(newsItem.published_at),
    }));

    return {
        ...response.data,
        items: modifiedItems,
    };
};
