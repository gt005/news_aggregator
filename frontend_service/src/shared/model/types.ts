export interface INews {
    id: string,
    title: string,
    url: string,
    source: string,
    description: string,
    published_at: Date;
}

export interface INewsApiSchema {
    id: string,
    title: string,
    url: string,
    source: string,
    description: string,
    published_at: string;
}


export enum NewsActionType {
    ADD = 'add',
    REMOVE = 'remove',
}

export interface FetchNewsListResult {
    items: INewsApiSchema[],
    page: number,
    pages: number;
}