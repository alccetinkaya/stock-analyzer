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
    log(data: string) { }

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
        if (errorList.length > 0) {
            console.log("Application Errors");
            errorList.forEach(error => {
                let data: any = error.data;
                if (typeof error.data == 'object') {
                    data = JSON.stringify(error.data)
                }

                console.log(error.message + " => " + data)
            });
        }

        let warnList: ReportData.WarnData[];
        warnList = super.getWarnList();
        if (warnList.length > 0) {
            console.log("Application Warnings");
            warnList.forEach(warn => {
                let data: any = warn.data;
                if (typeof warn.data == 'object') {
                    data = JSON.stringify(warn.data)
                }

                console.log(warn.message + " => " + data)
            });
        }

        let infoList: ReportData.InfoData[];
        infoList = super.getInfoList();
        if (infoList.length > 0) {
            console.log("Application Info");
            infoList.forEach(info => {
                let data: any = info.data;
                if (typeof info.data == 'object') {
                    data = JSON.stringify(info.data)
                }

                console.log(info.message + " => " + data)
            });
        }
    }

    analyze(data: string) {
        console.log(data);
    }

    log(data: string) {
        console.log(data);
    }
}

export class FileReportService extends ReportService {
    _dir: string;
    _fileName: string;
    _reportFile: any;

    constructor(dir: string = null, fileName: string = null) {
        super();
        this._reportFile = null;
        this._dir = dir;
        this._fileName = fileName;
    }

    _writeToReportFile(data: string) {
        if (this._reportFile !== null) {
            this._reportFile.write(strip(data) + "\n");
        }
    }

    report() {
        let errorList: ReportData.ErrorData[];
        errorList = super.getErrorList();
        if (errorList.length > 0) {
            this._writeToReportFile("Application Errors");
            errorList.forEach(error => {
                let data: any = error.data;
                if (typeof error.data == 'object') {
                    data = JSON.stringify(error.data)
                }

                this._writeToReportFile(error.message + " => " + data)
            });
        }

        let warnList: ReportData.WarnData[];
        warnList = super.getWarnList();
        if (warnList.length > 0) {
            this._writeToReportFile("Application Warnings");
            warnList.forEach(warn => {
                let data: any = warn.data;
                if (typeof warn.data == 'object') {
                    data = JSON.stringify(warn.data)
                }

                this._writeToReportFile(warn.message + " => " + data)
            });
        }

        let infoList: ReportData.InfoData[];
        infoList = super.getInfoList();
        if (infoList.length > 0) {
            this._writeToReportFile("Application Info");
            infoList.forEach(info => {
                let data: any = info.data;
                if (typeof info.data == 'object') {
                    data = JSON.stringify(info.data)
                }

                this._writeToReportFile(info.message + " => " + data)
            });
        }
    }

    analyze(data: string) {
        this._writeToReportFile(data);
    }

    log(data: string) {
        this._writeToReportFile(data);
    }

    setReportFile(dir: string, name: string): void {
        this.setReportDir(dir);
        this.setReportFileName(name);
    }

    getReportFile() {
        return this._dir + "/" + this._fileName;
    }

    setReportFileName(fileName: string) {
        if (fileName !== null && fileName !== undefined) {
            this._fileName = fileName;
        }
    }

    setReportFileNameIndex(fileName: string, index: number) {
        if (fileName !== null && fileName !== undefined) {
            let dotSplit = fileName.split(".");
            let underscoreSplit = dotSplit[0].split("_");
            let indexStr: string = "0" + index;

            this._fileName = underscoreSplit[0] + "_" + indexStr.substr(0, 2) + "." + dotSplit[1];
        }
    }

    getReportFileName(): string {
        return this._fileName;
    }

    setReportDir(dir: string) {
        if (dir !== null && dir !== undefined) {
            this._dir = dir;
        }
    }

    getReportDir(): string {
        return this._dir;
    }

    _checkIfReportFileExists(counter: number = 0) {
        if (counter >= 100) return;

        let exists: boolean = fs.existsSync(this.getReportFile());
        if (exists) {
            this.setReportFileNameIndex(this.getReportFileName(), ++counter);
            this._checkIfReportFileExists(counter);
        }
    }

    _checkReportFile() {
        if (this.getReportDir() == null) this.setReportDir("./report");
        if (this.getReportFileName() == null) this.setReportFileName(TimeUtilities.getDateAsYearMonthDay(Date.now()) + "_00" + ".txt");

        this._checkIfReportFileExists();
    }

    createReportFile() {
        this._checkReportFile();

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



    async createReportFileSync() {
        this._checkReportFile();

        fs.mkdirSync(this.getReportDir(), { recursive: true });
        this._reportFile = fs.createWriteStream(this.getReportFile(), {
            flags: 'w'
        });
    }
}