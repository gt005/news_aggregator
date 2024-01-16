import Title from '@/shared/ui/Title'
import { INews, NewsActionType } from '@/shared/model/types';
import { Feed } from '@/widgets/feed'
import { fetchMainFeedPageNews } from '../api/fetchers';


const FeedPage = () => {
    return (
        <>
            <Title title="Новости" />
            <Feed newsActionType={NewsActionType.ADD} fetchNews={fetchMainFeedPageNews} />
        </>
    );
}
export default FeedPage;
