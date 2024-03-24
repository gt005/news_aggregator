import { MyFolderInlineButtonsBlock } from "@/widgets/myFolderInlineButtonsBlock";
import { FC, useEffect, useState } from "react";
import { Flex, Modal, Button, Layout } from "antd"
import { getCurrentUser } from "@/shared/lib/storage/user";
import { User } from "@/shared/model/types/users";
import styles from './NavigationSider.module.sass'
import { LoginModal } from "@/widgets/loginModal";
import { RegistrationModal } from "@/widgets/registrationModal";

const { Sider, Content } = Layout;

export const NavigationSider: FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const user = getCurrentUser();
        setUser(user);
    }, []);

    return (
        <>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                className={`${styles.siderContainer} ${isCollapsed ? styles.collapsedSider : ''}`}
                onCollapse={(collapsed) => {
                    setIsCollapsed(collapsed);
                }}
            >
                <Flex align="middle" className={styles.flexInsideContainder}>
                    {user ? (
                        <>
                            <div className={styles.mainText}>Добрый день, <a className={styles.profileLink} href={`/profile/${user.id}`}>{user.name}</a></div>
                        </>
                    ) : (
                        <>
                            <div className={styles.mainText}>Добрый день, <a className={styles.loginOpenModalLink} onClick={() => setIsLoginModalVisible(true)}>войти</a></div>
                        </>
                    )}
                    <a className={styles.mainFeedLink} href={`/`}>
                        <Button type="primary" block>
                            Лента
                        </Button>
                    </a>

                    <div className={styles.foldersContainer}>
                        <MyFolderInlineButtonsBlock />
                    </div>
                </Flex>
            </Sider>
            <Modal title={isLoginModalVisible ? 'Войти' : 'Регистрация'} open={isLoginModalVisible || isRegisterModalVisible} footer={null} onCancel={() => { setIsLoginModalVisible(false); setIsRegisterModalVisible(false) }}>
                <div className={styles.modalContent}>
                    {isLoginModalVisible && (
                        <>
                            <LoginModal />
                            <Button className={styles.centeredButton} type="text" onClick={() => { setIsRegisterModalVisible(true); setIsLoginModalVisible(false) }}>Нет аккаунта? Зарегистрироваться</Button>
                        </>
                    )}
                    {isRegisterModalVisible && (
                        <>
                            <RegistrationModal />
                            <Button className={styles.centeredButton} type="text" onClick={() => { setIsLoginModalVisible(true); setIsRegisterModalVisible(false) }}>Есть аккаунт? Войти</Button>
                        </>
                    )}
                </div>
            </Modal>
        </>
    )
}