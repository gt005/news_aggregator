import { INews } from "@/shared/model/types/news";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useState } from "react";
import styles from './NewsChartModal.module.sass';
import { Button, Form, Modal, Select } from "antd";
import { getAssetsList, getCandlesByTickerAndDate } from "@/shared/api/moexApi";
import { ExchangeAsset } from "@/shared/model/types/exchange_assets";


interface NewsChartModalProps {
    news: INews;
}

type SelectStockForm = {
    ticker: string;
}

export const NewsChartModal: FC<NewsChartModalProps> = ({ news }) => {
    const [form] = Form.useForm();
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [stockTickerList, setStockTickerList] = useState<ExchangeAsset[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!isChartModalOpen) return;

        getAssetsList().then((result) => {
            setStockTickerList(result);
        });

    }, [isChartModalOpen]);

    const onStockSelectFinish = async () => {
        const formData = form.getFieldsValue();

        const publishedAt = new Date(news.published_at);
        const thirtyMinutesEarlier = new Date(publishedAt.getTime() - 30 * 60000);
        const twoHoursLater = new Date(publishedAt.getTime() + 2 * 60 * 60000);

        const candles = await getCandlesByTickerAndDate(formData.ticker, thirtyMinutesEarlier, twoHoursLater, '5')
        setChartData(candles);
    }

    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <FontAwesomeIcon icon={faChartLine} className={styles.openChartModalButton} onClick={() => { setIsChartModalOpen(true) }} />

            <Modal width={1000} title="График акции по новости" open={isChartModalOpen} footer={null} onCancel={() => setIsChartModalOpen(false)}>
                <Form
                    form={form}
                    name="select"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onStockSelectFinish}
                >
                    <Form.Item<SelectStockForm>
                        label="Тикер акции"
                        name="ticker"
                        rules={[
                            {
                                required: true,
                                message: 'Выберите акцию'
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Выберите акцию"
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={stockTickerList.map((asset) => ({ label: `${asset.ticker} (${asset.name})`, value: asset.ticker }))}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Добавить
                        </Button>
                    </Form.Item>
                </Form>

                <div id="chart-container" style={{ width: '100%', height: '600px' }} >
                    <ul>
                        {chartData.map((candle, index) => (
                            <li key={index}>{candle}</li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </>

    );
}