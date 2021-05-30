import { HistoricalStockData, StockInfo } from "../models/stock.model";
import { MathUtilities } from "./math.utilities";
import { TimeUtilities } from "./time.utilities";

export class StockUtilities {
    static getStockInfoFromHistoricalData(historicalData: HistoricalStockData[], timestamp: number): StockInfo {
        let highArr: number[];
        let lowArr: number[];
        let closeArr: number[];
        let totalClose: number;

        // filter historical data according to past time
        // time range is between now and trade time
        historicalData = historicalData.filter(data => Date.now() - TimeUtilities.getDateAsTimestamp(data.date) <= timestamp);

        // check if filtered result doesn't has any data
        // it means that stock doesn't has enough data for given time range 
        if (historicalData.length <= 0) return null;

        // get high values infer from historical data
        highArr = historicalData.map(it => it.high);

        // get low values infer from historical data
        lowArr = historicalData.map(it => it.low);

        // get close values infer from historical data
        closeArr = historicalData.map(it => it.close);

        // add close values infer from historical data for calculation average
        totalClose = closeArr.reduce((acc, it) => acc + it, 0);

        return {
            average: MathUtilities.getPrecisedNumber(totalClose / closeArr.length),
            high: MathUtilities.getPrecisedNumber(MathUtilities.findMax(highArr)),
            low: MathUtilities.getPrecisedNumber(MathUtilities.findMin(lowArr)),
            close: MathUtilities.getPrecisedNumber(historicalData[historicalData.length - 1].close),
            current: undefined
        }
    }
}