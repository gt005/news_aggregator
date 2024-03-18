import { FetchNewsListResult, INews } from '@/shared/model/types/news';
import { useState, useEffect } from 'react';


const useNewsFeed = (fetchNews: (page: number) => Promise<FetchNewsListResult>) => {
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [newsList, setNewsList] = useState<INews[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const loadNews = async () => {
        if (!hasNextPage) return;

        const fetchedNews: FetchNewsListResult = await fetchNews(currentPage);

        const newsWithDateObjects = fetchedNews.items.map(news => ({
            ...news,
            published_at: new Date(news.published_at)
        }));
        setNewsList(prev => [...prev, ...newsWithDateObjects]);
        setHasNextPage(fetchedNews.page < fetchedNews.pages);
        setCurrentPage(prev => prev + 1);
        setIsInitialLoading(false);
    };

    useEffect(() => {
        loadNews();
    }, []);

    return { newsList, isInitialLoading, hasNextPage, loadNews };
};

export default useNewsFeed;
