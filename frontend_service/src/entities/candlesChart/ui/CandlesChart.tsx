import { Candle, ExchangeAsset } from '@/shared/model/types/exchange_assets';
import { FC } from 'react';

import { INews } from '@/shared/model/types/news';
import { getFormattedDateTime } from '@/shared/lib/time-utils';
import { Chart } from "react-google-charts";

interface CandlesChartProps {
    exchangeAsset: ExchangeAsset;
    news: INews;
    candles: Candle[];
}

export const CandlesChart: FC<CandlesChartProps> = ({ exchangeAsset, news, candles }) => {

    return (
        <div>
            <h3>{exchangeAsset.ticker}</h3>
            <h4>{news.title}</h4>
            <p>{getFormattedDateTime(news.published_at)}</p>
            <Chart
                width={'100%'}
                height={500}
                chartType="CandlestickChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['day', 'a', 'b', 'c', 'd'],
                    ...candles.map((candle) => [
                        getFormattedDateTime(candle.begin),
                        candle.low,
                        candle.open,
                        candle.close,
                        candle.high
                    ])
                ]}
                options={{
                    legend: 'none',
                    bar: { groupWidth: "90%" },
                    candlestick: {
                        fallingColor: { strokeWidth: 0, fill: "#ff2100" },
                        risingColor: { strokeWidth: 0, fill: "#00ff0a" },
                    },
                    hAxis: {
                        title: 'Время',
                    },
                    vAxis: {
                        title: 'Цена',
                    },
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    );
}
