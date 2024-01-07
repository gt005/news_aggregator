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
    const [ isLoading, setIsLoading ] = useState(true);

    setTimeout(() => {
        setIsLoading(false);
    }, 4000);

    return (
        <>
            <Title title="Новости" />
            <Feed newsActionType={NewsActionType.ADD} newsList={newsArray} isLoading={isLoading} />
        </>
    );
}

export default FeedPage;