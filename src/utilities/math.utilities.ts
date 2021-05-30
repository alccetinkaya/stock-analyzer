export class MathUtilities {
    static getPrecisedNumber(number: number, precise: number = 3): number {
        return Number(number.toPrecision(precise));
    }

    static findMax(data: number[]): number {
        return Math.max.apply(Math, data);
    }

    static findMin(data: number[]): number {
        return Math.min.apply(Math, data);
    }
}