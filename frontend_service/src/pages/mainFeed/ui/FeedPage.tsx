import Title from '@/shared/ui/Title'
import { NewsActionType } from '@/shared/model/types/news';
import { Feed } from '@/widgets/feed'
import { fetchMainFeedPageNews } from '../api/fetchers';
import { Layout } from 'antd';
import { NavigationSider } from '@/widgets/navigationSider';
import styles from './FeedPage.module.sass'


const { Sider, Content } = Layout;


export const FeedPage = () => {
    return (
        <>
            <Title title="Новости" />
            <Layout hasSider>
                <NavigationSider  />
                <Layout>
                    <Content>
                        <Feed newsActionType={NewsActionType.ADD} fetchNews={fetchMainFeedPageNews} />
                    </Content>
                </Layout>
            </Layout>
        </>
    );
}
