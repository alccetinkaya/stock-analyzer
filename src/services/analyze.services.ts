import * as StockModel from "../models/stock.model";
import { GeneralUtilities } from "../utilities/general.utilities";
import { MathUtilities } from "../utilities/math.utilities";
import { ReportUtility } from "../utilities/report.utilities";
import { StockUtilities } from "../utilities/stock.utilities";
import { TimeConvertionTypes, TimeUtilities } from "../utilities/time.utilities";
import { GeneralFinanceService, TechnicalFinanceService } from "./finance.services";
import { ReportService } from "./report.services";
const colors = require('colors/safe');

export class AnalyzeService extends ReportUtility {
    _gFinanceSvc: GeneralFinanceService;
    _tFinanceSvc: TechnicalFinanceService;

    constructor(reportServices: ReportService[], gFinanceService: GeneralFinanceService, tFinanceService: TechnicalFinanceService) {
        super(reportServices);
        this._gFinanceSvc = gFinanceService;
        this._tFinanceSvc = tFinanceService;
    }

    prepareAnalyzeResult({ caption = "", analyzeData, bottomLine = false, padEnd = null, headLine = false, endLine = false }): string {
        let result: string = "";

        if (headLine) result += "\n";
        result += caption + "\n";

        for (const data of analyzeData) {
            result += `${data.type}: ${data.value}`.padEnd(padEnd);
            if (bottomLine) result += "\n";
        }

        if (endLine) result += "\n";
        return result;
    }

    _getTermName(term: string): string {
        switch (term) {
            case StockModel.StockTerms.LONG:
                return "LONG TERM";
            case StockModel.StockTerms.MID:
                return "MID TERM";
            case StockModel.StockTerms.SHORT:
                return "SHORT TERM";
            default:
                return "";
        }
    }

    _getStockDescription(stockData: StockModel.StockData): string {
        return colors.bold.magenta(`==== ${stockData.name} (${this._getTermName(stockData.term)}) ====`);
    }

    _technicalAnalyze(reference: number, current: number, period: number) {
        let rate: number = MathUtilities.getPrecisedNumber((current - reference) / period);

        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.cyan("- Technical Analyze (Reference: Average) -"),
            analyzeData: [
                { type: "Future Value (FV)", value: this._tFinanceSvc.getFV(rate, current, period) },
                { type: "Compound Annual Growth Rate (CAGR)", value: this._tFinanceSvc.getCAGR(reference, current, period) },
                { type: "Rule of 72 (R72)", value: this._tFinanceSvc.getR72(rate) },
            ],
            bottomLine: true
        }));
    }

    async _dailyAnalyze(stockName: string): Promise<string> {
        let stockInfo: StockModel.StockInfo;

        stockInfo = await this._gFinanceSvc.getDailyStockInfo(stockName);
        return this.prepareAnalyzeResult({
            caption: colors.yellow("-- Daily Analyze --"),
            analyzeData: [
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Current", value: stockInfo.current },
            ],
            padEnd: 15,
            endLine: true
        });
    }

    async _longtermAnalyze(stock: StockModel.StockData, historicalData: StockModel.HistoricalStockData[]) {
        let stockInfo: StockModel.StockInfo;

        // stock description
        super.reportAnalyze(this._getStockDescription(stock));

        // daily
        super.reportAnalyze(await this._dailyAnalyze(stock.name));

        // 1 years
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(1, TimeConvertionTypes.YEAR));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 1 Years Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 1);

        // 3 years
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(3, TimeConvertionTypes.YEAR));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 3 Years Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 3);

        // 5 years
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(5, TimeConvertionTypes.YEAR));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 5 Years Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 5);
    }

    async _midtermAnalyze(stock: StockModel.StockData, historicalData: StockModel.HistoricalStockData[]) {
        let stockInfo: StockModel.StockInfo;

        // stock description
        super.reportAnalyze(this._getStockDescription(stock));

        // daily
        super.reportAnalyze(await this._dailyAnalyze(stock.name));

        // 6 months
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(6, TimeConvertionTypes.MONTH));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 6 Months Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 0.5);

        // 12 months
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(12, TimeConvertionTypes.MONTH));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 12 Months Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 1);

        // 24 months
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(24, TimeConvertionTypes.MONTH));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 24 Months Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15
        }));
        this._technicalAnalyze(stockInfo.average, stockInfo.close, 2);
    }

    async _shorttermAnalyze(stock: StockModel.StockData, historicalData: StockModel.HistoricalStockData[]) {
        let stockInfo: StockModel.StockInfo;

        // stock description
        super.reportAnalyze(this._getStockDescription(stock));

        // daily
        super.reportAnalyze(await this._dailyAnalyze(stock.name));

        // 2 weeks
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(2, TimeConvertionTypes.WEEK));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 2 Weeks Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15,
            endLine: true
        }));

        // 4 weeks
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(4, TimeConvertionTypes.WEEK));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 4 Weeks Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15,
            endLine: true
        }));

        // 8 weeks
        stockInfo = StockUtilities.getStockInfoFromHistoricalData(historicalData, TimeUtilities.convertTimestamp(8, TimeConvertionTypes.WEEK));
        if (stockInfo == null) return;
        super.reportAnalyze(this.prepareAnalyzeResult({
            caption: colors.yellow("-- 8 Weeks Analyze --"),
            analyzeData: [
                { type: "Average", value: stockInfo.average },
                { type: "High", value: stockInfo.high },
                { type: "Low", value: stockInfo.low },
                { type: "Close", value: stockInfo.close },
            ],
            padEnd: 15,
            endLine: true
        }));
    }

    async stockAnalyzer(stock: StockModel.StockData) {
        let historicalData: StockModel.HistoricalStockData[];

        try {
            switch (stock.term) {
                case StockModel.StockTerms.LONG:
                    // get 5 years historical data
                    historicalData = await this._gFinanceSvc.getHistoricalData(stock.name, 5, TimeConvertionTypes.YEAR);
                    await this._longtermAnalyze(stock, historicalData);
                    break;

                case StockModel.StockTerms.MID:
                    // get 3 years historical data
                    historicalData = await this._gFinanceSvc.getHistoricalData(stock.name, 3, TimeConvertionTypes.YEAR);
                    await this._midtermAnalyze(stock, historicalData);
                    break;

                case StockModel.StockTerms.SHORT:
                    // get 6 months historical data
                    historicalData = await this._gFinanceSvc.getHistoricalData(stock.name, 6, TimeConvertionTypes.MONTH);
                    await this._shorttermAnalyze(stock, historicalData);
                    break;

                default:
                    super.reportError({ message: "Stock Analyzer undefined stock term", data: stock.term });
                    break;
            }
        } catch (error) {
            if (error.message == 'Unauthorized') {
                super.log("Unauthorization error. Stock analysis will be tried again in 2 minutes...");
                await GeneralUtilities.sleep(120000);
                await this.stockAnalyzer(stock);
            }

            this.reportError({ message: "Analyze Exception", data: error.message });
        }
    }
}