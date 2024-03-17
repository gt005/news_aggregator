import Title from "@/shared/ui/Title"
import { FC } from "react"
import { Button, Layout } from 'antd';
import { useParams } from "react-router-dom"
import { NavigationSider } from "@/widgets/navigationSider";
import styles from './ProfilePage.module.sass'
import { getCurrentUser } from "@/shared/lib/storage/user";
import { logoutUser } from "@/shared/lib/logout";


const { Sider, Content } = Layout;


export const ProfilePage: FC = () => {
    const { userId } = useParams()
    const user = getCurrentUser();

    return (
        <>
            <Title title="Профиль" />
            <Layout hasSider>
                <NavigationSider />
                <Layout>
                    <Content>
                        {
                            (user && user.id === userId) ? (
                                <div className={styles.container}>
                                    <h1 className={styles.header}>Добрый день, {user.name}</h1>

                                    <div className={styles.infoContainer}>
                                        <h2 className={styles.infoContainerHeader}>Ваш профиль</h2>
                                        <p className={styles.infoContainerInfo}>Имя: {user.name}</p>
                                        <p className={styles.infoContainerInfo}>email: {user.email}</p>
                                    </div>
                                    <Button className={styles.logoutButton} danger type="text" onClick={logoutUser}>
                                        Выйти
                                    </Button>
                                </div>
                            ) : (
                                <div className={styles.container}>
                                    <h1>Профиль не найден</h1>
                                </div>
                            )
                        }
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}
