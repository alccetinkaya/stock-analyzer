export enum StockTerms {
    LONG = "long",
    MID = "mid",
    SHORT = "short"
}

export interface StockData {
    name: string;
    term: string;
}

export interface StockInfo {
    average: number;
    current: number;
    close: number;
    high: number;
    low: number;
}

export interface HistoricalStockData {
    close: number;
    high: number;
    low: number;
    date: Date;
}