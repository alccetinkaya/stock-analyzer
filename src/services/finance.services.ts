import { HistoricalStockData, StockInfo } from "../models/stock.model";
import { MathUtilities } from "../utilities/math.utilities";
import { TimeConvertionTypes, TimeUtilities } from "../utilities/time.utilities";

export class GeneralFinanceService {
    _service: any;

    constructor(service: any) {
        this._service = service;
    }

    convertTimeConvTypeToTimeInterval(timeConvType: string): string {
        switch (timeConvType) {
            case TimeConvertionTypes.YEAR:
                return '1d';
            case TimeConvertionTypes.MONTH:
                return '1d';
            case TimeConvertionTypes.WEEK:
                return '1d';
            case TimeConvertionTypes.DAY:
                return '1d';
            default:
                return '1d';
        }
    }

    async getHistoricalData(symbol: string, multiplier: number, timeConvType: string): Promise<HistoricalStockData[]> {
        let pastDate: string = TimeUtilities.getPastDate(Date.now(), multiplier, timeConvType);
        let interval: string = this.convertTimeConvTypeToTimeInterval(timeConvType);

        return await this._service.historical(symbol, { period1: pastDate, interval: interval });
    }

    async quote(symbol: string) {
        return await this._service.quoteCombine(symbol);
    }

    async getDailyStockInfo(symbol: string): Promise<StockInfo> {
        let result = await this.quote(symbol);
        return {
            current: result.regularMarketPrice,
            high: result.regularMarketDayHigh,
            low: result.regularMarketDayLow,
            close: undefined,
            average: undefined
        }
    }
}

export class TechnicalFinanceService {
    _service: any;

    constructor(service: any) {
        this._service = service;
    }

    getCAGR(bVal: number, eVal: number, period: number): number {
        return this._service.CAGR(bVal, eVal, period);
    }

    getFV(rate: number, cash: number, period: number): number {
        return this._service.FV(rate, cash, period);
    }

    getR72(rate: number): number {
        return MathUtilities.getPrecisedNumber(this._service.R72(rate), 4)
    }
}