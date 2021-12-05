export default class AsynccError extends Error {
    /**
     * @param {string} message
     * @param {Error[]} errors
     * @param {number[]} errpos
     * @param {any[]} [results]
     */
    constructor(message: string, errors: Error[], errpos: number[], results?: any[] | undefined);
    errors: Error[];
    errpos: number[];
    results: any[] | undefined;
}
