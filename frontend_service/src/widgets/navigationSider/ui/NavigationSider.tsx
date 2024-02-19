import { MyFolderInlineButtonsBlock } from "@/widgets/myFolderInlineButtonsBlock";
import { FC } from "react";
import { Flex } from "antd"
import { Layout } from 'antd';


const { Sider, Content } = Layout;

export const NavigationSider: FC = () => {
    return (
        <>
            <Sider
                width="20%"
                style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
            >
                <Flex align="middle">
                    <MyFolderInlineButtonsBlock />
                </Flex>
            </Sider>
        </>
    )
}
