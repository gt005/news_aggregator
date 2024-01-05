import { NewsCard } from '@/entities/news'
import { INews } from '@/shared/types';
import styles from './Feed.module.sass';
import { AddToFolderButton } from '@/features/news/add-to-folder-button';

const newsArray: INews[] = [
    {
        id: 1,
        source: 'РБК',
        title: 'Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
        text: 'Компания была зарегистрирована в САР на острове Октябрьский в Калининградской области. Торги бумаги ЕМС были приостановлены ранее в декабре. Возможно, пауза в торгах продлится около месяца',
        link: 'http://example.com',
        dateTime: new Date('2023-10-05T16:24:00')
    },
    {
        id: 2,
        source: 'РБК',
        title: 'Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
        text: 'Компания была зарегистрирована в САР на острове Октябрьский в Калининградской области. Торги бумаги ЕМС были приостановлены ранее в декабре. Возможно, пауза в торгах продлится около месяца',
        link: 'http://example.com',
        dateTime: new Date('2023-10-05T16:24:00')
    },
    {
        id: 3,
        source: 'РБК',
        title: 'Головная структура сети «ЕвроМедЦентр» перерегистрировалась в Россию',
        text: 'Компания была зарегистрирована в САР на острове Октябрьский в Калининградской области. Торги бумаги ЕМС были приостановлены ранее в декабре. Возможно, пауза в торгах продлится около месяца',
        link: 'http://example.com',
        dateTime: new Date('2023-10-05T16:24:00')
    }
];

export const Feed = () => {
    return (
        <div className={styles.container}>
            {newsArray.map(news => (
                <NewsCard key={news.id} news={news} ActionButton={AddToFolderButton} />
            ))}
        </div>
    )
}