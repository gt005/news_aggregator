import Title from '@/shared/ui/Title'
import { NewsActionType } from '@/shared/model/types';
import { Feed } from '@/widgets/feed'
import { fetchMainFeedPageNews } from '../api/fetchers';
import { Layout } from 'antd';
import { NavigationSider } from '@/widgets/navigationSider';


const { Sider, Content } = Layout;


export const FeedPage = () => {
    return (
        <>
            <Title title="Новости" />
            <Layout hasSider>
                <NavigationSider />
                <Content>
                    <Feed newsActionType={NewsActionType.ADD} fetchNews={fetchMainFeedPageNews} />
                </Content>
            </Layout>
        </>
    );
}
