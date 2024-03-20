import { Candle, ExchangeAsset } from '@/shared/model/types/exchange_assets';
import { serverUrl } from "@/shared/const";
import axios from 'axios';

export const getAssetsList = async (): Promise<ExchangeAsset[]> => {
    const response = await axios.get(
        `/api/v1/exchange_assets/assets`,
        { baseURL: serverUrl }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching user');
    }

    return response.data;
}

export const getCandlesByTickerAndDate = async (ticker: string, from: Date, to: Date, interval: string): Promise<Candle[]> => {
    const response = await axios.get(
        `/api/v1/exchange_assets/assets/${ticker}`,
        {
            params: {
                start_time: from.toISOString(),
                end_time: to.toISOString(),
                interval: interval
            },
            baseURL: serverUrl
        }
    );

    if (response.status !== 200) {
        throw new Error('Error occurred while fetching user');
    }

    for (let i = 0; i < response.data.length; i++) {
        response.data[i].begin = new Date(response.data[i].begin);
        response.data[i].end = new Date(response.data[i].end);
    }

    return response.data;
}
