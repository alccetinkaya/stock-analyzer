import * as StockModel from "../models/stock.model";
import StockData from "../data/stock.data.json"
import { ReportService } from "./report.services";
import { GeneralFinanceService } from "./finance.services";
import { ReportUtility } from "../utilities/report.utilities";

export class StockService extends ReportUtility {
    _stockList: StockModel.StockData[];
    _gFinanceSvc: GeneralFinanceService;

    constructor(reportServices: ReportService[], generalFinanceService: GeneralFinanceService) {
        super(reportServices);

        this._stockList = [];
        this._gFinanceSvc = generalFinanceService;
    }

    showAllStocks() {
        console.log(this._stockList);
    }

    loadStockData() {
        for (const stock of StockData) {
            if (this.validateStockData(stock)) {
                this._stockList.push({ name: stock.name, term: stock.term });
            }
        }
    }

    async validateStockData(stockData: any) {
        let requiredFields: string[] = "name term".split(" ");

        for (const field of requiredFields) {
            if (!stockData[field]) {
                super.reportError({ message: `Stock data doesn't have required field`, data: stockData });
                return false;
            }
        }

        if (stockData.term !== StockModel.StockTerms.LONG &&
            stockData.term !== StockModel.StockTerms.MID &&
            stockData.term !== StockModel.StockTerms.SHORT) {
            super.reportError({ message: `Stock data's term type is not suitable`, data: stockData });
            return false;
        }

        return true;
    }

    getStockByIndex(index: number): StockModel.StockData {
        return this._stockList[index];
    }

    getStockNameByIndex(index: number): string {
        return this._stockList[index].name;
    }

    getStockNumber() {
        return this._stockList.length;
    }
}