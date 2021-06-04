export enum StockTerms {
    LONG = "LONG",
    MID = "MID",
    SHORT = "SHORT"
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