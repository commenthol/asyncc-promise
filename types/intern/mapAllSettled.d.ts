/** @typedef {import('../types').Status} Status */
/**
 * @typedef {object} ResultsOrError
 * @property {Error[]} errors
 * @property {number[]} errpos
 * @property {any[]} results
 */
/**
 * @param {ResultsOrError|any[]} resultsOrErr
 * @param {boolean} [isCatched]
 * @returns {Status[]}
 */
export function mapAllSettled(resultsOrErr: ResultsOrError | any[], isCatched?: boolean | undefined): Status[];
export type Status = import('../types').Status;
export type ResultsOrError = {
    errors: Error[];
    errpos: number[];
    results: any[];
};
