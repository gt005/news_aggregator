import Title from '@/shared/ui/Title'
import { INews, NewsActionType } from '@/shared/types';
import { Feed } from '@/widgets/feed'
import { useState } from 'react';


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


const FeedPage = () => {
    const tmp = (page: number): Promise<INews[]> => {
        console.log(page)
        return new Promise((resolve, rejest) => {
            setTimeout(() => {
                const returnArray: INews[] = newsArray.map(news => ({
                    ...news,
                    title: `From ${page} set and id=${news.id * page}`,
                    id: news.id * page
                }));
                resolve(returnArray);
            }, 1000);
        })
    }

    return (
        <>
            <Title title="Новости" />
            <Feed newsActionType={NewsActionType.ADD} fetchNews={tmp} />
        </>
    );
}

export default FeedPage;