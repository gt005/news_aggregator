import { useState, type FC } from 'react';

import { NewsCard } from '@/entities/news'
import styles from './Feed.module.sass';
import { AddToFolderButton } from '@/features/news/add-to-folder-button';
import { RemoveFromFolderButton } from '@/features/news/remove-from-folder-button';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { NewsActionType, FetchNewsListResult } from '@/shared/model/types/news';
import useNewsFeed from '../model/hooks';
import { Folder } from '@/shared/model/types/folders';
import { getCurrentUser } from '@/shared/lib/storage/user';
import { User } from '@/shared/model/types/users';

interface FeedProps {
    newsActionType: NewsActionType | null
    folder: Folder | null,
    fetchNews: (page: number) => Promise<FetchNewsListResult>
}

export const Feed: FC<FeedProps> = ({ newsActionType, folder, fetchNews }) => {
    const [user, setUser] = useState<User | null>(null);
    const { newsList, isInitialLoading, hasNextPage, loadNews } = useNewsFeed(fetchNews);
    const { ref, inView } = useInView();
    
    let ActionButton = newsActionType === NewsActionType.ADD
        ? AddToFolderButton
        : newsActionType === NewsActionType.REMOVE
            ? RemoveFromFolderButton
            : null;
    
    if (!user) {
        ActionButton = null;
    }

    useEffect(() => {
        if (inView) loadNews();
        const user = getCurrentUser();
        setUser(user);
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
                            <div key={news.id} className={styles.newsCardBlock}>
                                <NewsCard folder={folder} news={news} ActionButton={ActionButton} isLoading={isInitialLoading} />
                                
                            </div>
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
