import { ReportService } from "../services/report.services";
import * as ReportData from "../models/report-data.model"

export abstract class ReportUtility extends ReportService {
    _reportServices: ReportService[];

    constructor(reportServices: ReportService[]) {
        super();
        this._reportServices = reportServices;
    }

    reportError(data: ReportData.ErrorData) {
        for (const reportService of this._reportServices) {
            reportService.error(data);
        }
    }

    reportWarn(data: ReportData.WarnData) {
        for (const reportService of this._reportServices) {
            reportService.warn(data);
        }
    }

    reportInfo(data: ReportData.InfoData) {
        for (const reportService of this._reportServices) {
            reportService.info(data);
        }
    }

    reportAnalyze(data: string) {
        for (const reportService of this._reportServices) {
            reportService.analyze(data);
        }
    }

    log(data: string) {
        for (const reportService of this._reportServices) {
            reportService.log(data);
        }
    }
}