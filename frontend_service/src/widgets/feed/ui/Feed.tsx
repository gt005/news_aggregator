import { type FC } from 'react';

import { NewsCard } from '@/entities/news'
import styles from './Feed.module.sass';
import { AddToFolderButton } from '@/features/news/add-to-folder-button';
import { RemoveFromFolderButton } from '@/features/news/remove-from-folder-button';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { NewsActionType, FetchNewsListResult } from '@/shared/model/types/news';
import useNewsFeed from '../model/hooks';
import { Folder } from '@/shared/model/types/folders';

interface FeedProps {
    newsActionType: NewsActionType | null
    folder: Folder | null,
    fetchNews: (page: number) => Promise<FetchNewsListResult>
}

export const Feed: FC<FeedProps> = ({ newsActionType, folder, fetchNews }) => {
    const { newsList, isInitialLoading, hasNextPage, loadNews } = useNewsFeed(fetchNews);
    const { ref, inView } = useInView();

    const ActionButton = newsActionType === NewsActionType.ADD
        ? AddToFolderButton
        : newsActionType === NewsActionType.REMOVE
            ? RemoveFromFolderButton
            : null;

    useEffect(() => {
        if (inView) loadNews();
    }, [inView]);

    return (
        <div className={styles.container}>
            {isInitialLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                    <NewsCard key={index} folder={folder} news={null} ActionButton={ActionButton} isLoading={isInitialLoading} />
                ))
            ) : (
                <>
                    {newsList.length > 0 ? (
                        newsList.map(news => (
                            <NewsCard key={news.id} folder={folder} news={news} ActionButton={ActionButton} isLoading={isInitialLoading} />
                        ))
                    ) : (
                        <div className={styles.emptyFeed}>В ленте пусто</div>
                    )}
                    {hasNextPage && <div ref={ref}><NewsCard folder={null} news={null} ActionButton={null} isLoading={true} /></div>}
                </>
            )}
        </div>
    );
}
