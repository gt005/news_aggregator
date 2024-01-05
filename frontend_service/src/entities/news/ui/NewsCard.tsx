import React, { ReactElement, FC } from 'react';
import { INews } from '@/shared/types';
import { getFormattedTime, getFormattedDate } from '@/shared/lib/time-utils';
import styles from './NewsCard.module.sass';

interface NewsCardProps {
    news: INews;
    ActionButton?: React.ComponentType<{ news: INews }>
}

export const NewsCard: FC<NewsCardProps> = ({ news, ActionButton }) => {
    return (
        <div className={styles['news-card']}>
            <div className={styles['news-card__container']}>
                <a href={news.link} target="_blank" rel="noopener noreferrer" className={styles['news-card__container__source-link']}>
                    <span className="news-source">{news.source}</span>
                </a>
                <div className={styles['news-card__container__article-text']}>
                    <h3 className="news-title">{news.title}</h3>
                    <p className="news-summary">{news.text}</p>
                </div>
                <div className={styles['news-card__container__date-time-block']}>
                    <span className="news-time">{getFormattedTime(news.dateTime)}</span>
                    <span className="news-date">{getFormattedDate(news.dateTime)}</span>
                </div>
            </div>
            {ActionButton && <ActionButton news={news} />}
        </div>
    );
}
