export interface INews {
    id: number,
    source: string,
    title?: string,
    text: string,
    link: string,
    dateTime: Date
}

export enum NewsActionType {
    ADD = 'add',
    REMOVE = 'remove',
}

export interface FetchNewsListResult {
    newsList: INews[],
    hasNextPage: boolean;
}