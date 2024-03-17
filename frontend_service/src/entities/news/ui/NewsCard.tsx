import React, { ReactElement, FC } from 'react';
import { INews } from '@/shared/model/types/news';
import { getFormattedTime, getFormattedDate } from '@/shared/lib/time-utils';
import styles from './NewsCard.module.sass';
import { Skeleton } from 'antd';


interface NewsCardProps {
    news: INews | null; // news может быть null, если данные еще загружаются
    ActionButton: React.ComponentType<{ news: INews }> | null;
    isLoading: boolean;
}

export const NewsCard: FC<NewsCardProps> = ({ news, ActionButton, isLoading }) => {
    if (isLoading || news === null) {
        return (
            <div className={styles['news-card']}>
                <Skeleton active />
            </div>
        );
    }

    return (
        <div className={styles['news-card']}>
            <div className={styles['news-card__container']}>
                <a href={news!.url} target="_blank" rel="noopener noreferrer" className={styles['news-card__container__source-link']}>
                    <span className="news-source">{news!.source}</span>
                </a>
                <div className={styles['news-card__container__article-text']}>
                    <h3 className="news-title">{news!.title}</h3>
                    <p className="news-summary">{news!.description}</p>
                </div>
                <div className={styles['news-card__container__date-time-block']}>
                    <span className="news-time">{getFormattedTime(new Date(news!.published_at))}</span>
                    <span className="news-date">{getFormattedDate(new Date(news!.published_at))}</span>
                </div>
            </div>
            {ActionButton && <ActionButton news={news!} />}
        </div>
    );
}
