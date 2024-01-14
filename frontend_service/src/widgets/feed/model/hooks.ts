import { FetchNewsListResult, INews } from '@/shared/model/types';
import { useState, useEffect } from 'react';



const useNewsFeed = (fetchNews: (page: number) => Promise<FetchNewsListResult>) => {
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [newsList, setNewsList] = useState<INews[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const loadNews = async () => {
        if (!hasNextPage) return;

        const fetchedNews = await fetchNews(currentPage);
        const newsWithDateObjects = fetchedNews.newsList.map(news => ({
            ...news,
            dateTime: new Date(news.dateTime)
        }));
        setNewsList(prev => [...prev, ...newsWithDateObjects]);
        setHasNextPage(fetchedNews.hasNextPage);
        setCurrentPage(prev => prev + 1);
        setIsInitialLoading(false);
    };

    useEffect(() => {
        loadNews();
    }, []);

    return { newsList, isInitialLoading, hasNextPage, loadNews };
};

export default useNewsFeed;
