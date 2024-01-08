import { useState, type FC, useRef } from 'react';

import { NewsCard } from '@/entities/news'
import { INews } from '@/shared/types';
import styles from './Feed.module.sass';
import { AddToFolderButton } from '@/features/news/add-to-folder-button';
import { RemoveFromFolderButton } from '@/features/news/remove-from-folder-button';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { NewsActionType } from '@/shared/types';


interface FeedProps {
    newsActionType: NewsActionType | null,
    fetchNews: (page: number) => Promise<INews[]>;
}


export const Feed: FC<FeedProps> = ({ newsActionType, fetchNews }) => {
    const ActionButton = newsActionType === NewsActionType.ADD
        ? AddToFolderButton
        : newsActionType === NewsActionType.REMOVE
            ? RemoveFromFolderButton
            : null;

    const { ref, inView } = useInView();
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [newsList, setNewsList] = useState<INews[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const loadNews = async (page: number) => {
        const fetchedNews = await fetchNews(page);
        setNewsList(prev => [...prev, ...fetchedNews]);
        setCurrentPage(page + 1);
        setIsInitialLoading(false);
    };

    useEffect(() => {
        loadNews(currentPage);
    }, []);

    useEffect(() => {
        if (inView) {
            loadNews(currentPage);
        }
    }, [inView])

    return (
        <div className={styles.container}>
            {isInitialLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <NewsCard key={index} news={null} ActionButton={ActionButton} isLoading={isInitialLoading} />
                ))
                :
                <>
                    {newsList.map(news => (
                        <NewsCard key={news.id} news={news} ActionButton={ActionButton} isLoading={isInitialLoading} />
                    ))}
                    <div ref={ref}>
                        <NewsCard news={null} ActionButton={null} isLoading={true} />
                    </div>
                </>
            }
        </div>
    );
}