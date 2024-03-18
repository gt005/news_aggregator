import { ExchangeAsset } from '@/shared/model/types/exchange_assets';
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

export const getCandlesByTickerAndDate = async (ticker: string, from: Date, to: Date, interval: string): Promise<any> => {
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

    return response.data;
}
