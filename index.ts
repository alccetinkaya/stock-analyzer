import { Finance } from "financejs";
import yahooFinance from "yahoo-finance2";
import { ErrorData } from "./src/models/report-data.model";
import { StockData } from "./src/models/stock.model";
import { AnalyzeService } from "./src/services/analyze.services";
import { GeneralFinanceService, TechnicalFinanceService } from "./src/services/finance.services";
import { ConsoleReportService, FileReportService, ReportService } from "./src/services/report.services";
import { StockService } from "./src/services/stock-data.services";
require("dotenv").config();

function createReportServices(): Array<ReportService> {
    let consoleReportService = new ConsoleReportService();
    let fileReportService = new FileReportService();

    return [consoleReportService, fileReportService]
}

function setReportFileViaEnv(reportServices: ReportService[]) {
    for (const reportService of reportServices) {
        if (reportService instanceof FileReportService) {
            reportService.setReportFile(process.env.REPORT_DIR, process.env.REPORT_FILE_NAME);
        }
    }
}

function createReportFile(reportServices: ReportService[]) {
    for (const reportService of reportServices) {
        if (reportService instanceof FileReportService) {
            reportService.createReportFileSync();
        }
    }
}

async function startAnalyze() {
    // create application report services
    let reportServices: ReportService[] = createReportServices();

    // set report file directory and name via enviroment variables
    setReportFileViaEnv(reportServices);

    // create report file
    createReportFile(reportServices);

    // create general finance services
    let gFinanceService = new GeneralFinanceService(yahooFinance);
    let tFinanceService = new TechnicalFinanceService(new Finance());

    // create stock service
    let stockService = new StockService(reportServices, gFinanceService);
    stockService.loadStockData();

    // create analyze service
    let analyzeService = new AnalyzeService(reportServices, gFinanceService, tFinanceService);

    switch (process.argv.length) {
        case 2:
            // analyze all stocks in data
            for (let index = 0; index < stockService.getStockNumber(); index++) {
                await analyzeService.stockAnalyzer(stockService.getStockByIndex(index));
            }
            break;
        case 4:
            //analyze given stock
            let stockData: StockData = { name: process.argv[2], term: process.argv[3] };
            await analyzeService.stockAnalyzer(stockData);

            break;
        default:
            let errorMsg: ErrorData = {
                message: "Number of arguments must be 2 (node, ${targetDir}/index.js) or 4 (node, ${targetDir}/index.js, <stock_name>, <term_type>)",
                data: process.argv
            };

            for (let reportService of reportServices) {
                reportService.error(errorMsg);
            }
            break;
    }

    // application report
    for (let reportService of reportServices) {
        reportService.report();
    }
}

async function start() {
    try {
        await startAnalyze();
    } catch (error) {
        // create application report services
        let reportServices: ReportService[] = createReportServices();

        for (let reportService of reportServices) {
            reportService.error({ message: "Application unhandled error", data: error.message });
            reportService.report();
        }
    }
}

start();