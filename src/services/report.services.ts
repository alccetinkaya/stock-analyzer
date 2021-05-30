import * as ReportData from "../models/report-data.model";
import fs from 'fs';
import { TimeUtilities } from "../utilities/time.utilities";
const strip = require('strip-color');

export interface ReportInterface {
    error(data: ReportData.ErrorData): any
    warn(warn: ReportData.WarnData): any
    info(info: ReportData.InfoData): any
}

export abstract class ReportService implements ReportInterface {
    _errorList: ReportData.ErrorData[];
    _warnList: ReportData.WarnData[];
    _infoList: ReportData.InfoData[];

    constructor() {
        this._errorList = [];
        this._warnList = [];
        this._infoList = [];
    }

    error(data: ReportData.ErrorData) {
        this._errorList.push(data);
    }

    warn(data: ReportData.InfoData) {
        this._warnList.push(data);
    }

    info(data: ReportData.InfoData) {
        this._infoList.push(data);
    }

    analyze(data: string) { }
    report() { }

    getErrorList(): ReportData.ErrorData[] {
        return this._errorList;
    }

    getWarnList(): ReportData.WarnData[] {
        return this._warnList;
    }

    getInfoList(): ReportData.InfoData[] {
        return this._infoList;
    }
}

export class ConsoleReportService extends ReportService {
    constructor() {
        super();
    }

    report() {
        let errorList: ReportData.ErrorData[];

        errorList = super.getErrorList();

        if (errorList.length <= 0) {
            return;
        }

        console.log("CONSOLE REPORT SERVICE - Errors");

        errorList.forEach(error => {
            let data: any = error.data;
            if (typeof error.data == 'object') {
                data = JSON.stringify(error.data)
            }

            console.log(error.message + " => " + data)
        });
    }

    analyze(data: string) {
        console.log(data);
    }
}

export class FileReportService extends ReportService {
    _dir: string;
    _fileName: string;
    _reportFile: any;

    constructor() {
        super();
        this._reportFile = null;
        this._dir = "./report";
        this._fileName = TimeUtilities.getDateAsYearMonthDay(Date.now()) + ".txt";
    }

    report() {
        let errorList: ReportData.ErrorData[];

        errorList = super.getErrorList();

        if (errorList.length <= 0) {
            return;
        }

        console.log("FILE REPORT SERVICE - Errors");

        errorList.forEach(error => {
            let data: any = error.data;
            if (typeof error.data == 'object') {
                data = JSON.stringify(error.data)
            }

            console.log(error.message + " => " + data)
        });
    }

    analyze(data: string) {
        if (this._reportFile !== null) {
            this._reportFile.write(strip(data) + "\n");
        }
    }

    setReportFile(dir: string, name: string): void {
        this.setReportDir(dir);
        this.setReportFileName(name);
    }

    getReportFile() {
        return this._dir + "/" + this._fileName;
    }

    setReportFileName(fileName: string) {
        if (fileName !== null || fileName !== undefined) {
            this._fileName = fileName;
        }
    }

    getReportFileName(): string {
        return this._fileName;
    }

    setReportDir(dir: string) {
        if (dir !== null || dir !== undefined) {
            this._dir = dir;
        }
    }

    getReportDir(): string {
        return this._dir;
    }

    createReportFile() {
        fs.mkdir(this.getReportDir(), { recursive: true }, err => {
            if (err) {
                super.error({ message: "Create report file is unsuccesful", data: err });
                return;
            }

            this._reportFile = fs.createWriteStream(this.getReportFile(), {
                flags: 'w'
            });
        });
    }
}