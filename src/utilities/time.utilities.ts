enum TimeDefinitions {
    ONE_DAY_TIMESTAMP_MS = 86400000,
    ONE_WEEK_TIMESTAMP_MS = ONE_DAY_TIMESTAMP_MS * 7,
    ONE_MONTH_TIMESTAMP_MS = ONE_DAY_TIMESTAMP_MS * 31,
    ONE_YEAR_TIMESTAMP_MS = ONE_DAY_TIMESTAMP_MS * 365
}

export enum TimeConvertionTypes {
    YEAR = 'year',
    MONTH = 'month',
    WEEK = 'week',
    DAY = 'day'
}

export class TimeUtilities {
    constructor() {
    }

    static getDateAsYearMonthDay(timestamp: number) {
        return new Date(timestamp).toJSON().slice(0, 10);
    }

    static convertTimestamp(multiplier: number, timeConvType: string): number {
        let factor: number;

        switch (timeConvType) {
            case TimeConvertionTypes.YEAR:
                factor = TimeDefinitions.ONE_YEAR_TIMESTAMP_MS;
                break;

            case TimeConvertionTypes.MONTH:
                factor = TimeDefinitions.ONE_MONTH_TIMESTAMP_MS;
                break;

            case TimeConvertionTypes.WEEK:
                factor = TimeDefinitions.ONE_WEEK_TIMESTAMP_MS;
                break;

            case TimeConvertionTypes.DAY:
                factor = TimeDefinitions.ONE_DAY_TIMESTAMP_MS;
                break;

            default:
                return 0;
        }

        return multiplier * factor;
    }

    static getPastDate(timestamp: number, multiplier: number, timeConvType: string): string {
        return this.getDateAsYearMonthDay(timestamp - this.convertTimestamp(multiplier, timeConvType)); //new Date(timestamp - this.convertTimestamp(multiplier, timeConvType)).toJSON().slice(0, 10);
    }

    static getDateAsTimestamp(date: any): number {
        return new Date(date).getTime();
    }
}