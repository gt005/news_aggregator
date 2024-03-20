export interface ExchangeAsset {
    ticker: string;
    name: string;
}

export interface Candle {
    open: number;
    close: number;
    high: number;
    low: number;
    value: number;
    volume: number;
    begin: Date;
    end: Date;
}
