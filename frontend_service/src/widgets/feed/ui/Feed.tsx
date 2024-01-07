import { type FC } from 'react';

import { NewsCard } from '@/entities/news'
import { INews } from '@/shared/types';
import styles from './Feed.module.sass';
import { AddToFolderButton } from '@/features/news/add-to-folder-button';
import { RemoveFromFolderButton } from '@/features/news/remove-from-folder-button';

import { NewsActionType } from '@/shared/types';


interface FeedProps {
    newsActionType: NewsActionType | null,
    newsList: INews[],
    isLoading: boolean;
}

export const Feed: FC<FeedProps> = ({ newsActionType, newsList, isLoading }) => {
    const ActionButton = newsActionType === NewsActionType.ADD
                        ? AddToFolderButton
                        : newsActionType === NewsActionType.REMOVE
                        ? RemoveFromFolderButton
                        : null;

    return (
        <div className={styles.container}>
            {newsList.map(news => (
                <NewsCard key={news.id} news={news} ActionButton={ActionButton} isLoading={isLoading}/>
            ))}
        </div>
    );
}