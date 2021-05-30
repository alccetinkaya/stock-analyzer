import { Finance } from "financejs";
import yahooFinance from "yahoo-finance2";
import { AnalyzeService } from "./src/services/analyze.services";
import { GeneralFinanceService, TechnicalFinanceService } from "./src/services/finance.services";
import { ConsoleReportService, FileReportService } from "./src/services/report.services";
import { StockService } from "./src/services/stock-data.services";

async function start() {
    // create application report services
    let consoleReportService = new ConsoleReportService();
    let fileReportService = new FileReportService();
    fileReportService.createReportFile();

    // create general finance services
    let gFinanceService = new GeneralFinanceService(yahooFinance);
    let tFinanceService = new TechnicalFinanceService(new Finance()); 

    // create stock service
    let stockService = new StockService([consoleReportService, fileReportService], gFinanceService);
    stockService.loadStockData();

    // create analyze service
    let analyzeService = new AnalyzeService([consoleReportService, fileReportService], gFinanceService, tFinanceService);

    // analyze stock
    for (let index = 0; index < stockService.getStockNumber(); index++) {
        await analyzeService.stockAnalyzer(stockService.getStockByIndex(index));
    }

    // run report services action
    consoleReportService.report();
    fileReportService.report();
}

start();