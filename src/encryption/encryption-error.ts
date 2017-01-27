/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 * Class that represents an error in an encryption error.
 */
export class EncryptionError extends Error {

    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    public name: string = "EncryptionError";

    /**
     * Encryption algorithm.
     * @type {number}
     */
    public algorithm: string;

    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(message: string, algorithm: string) {
        super(message);
        this.message = message;
        this.algorithm = algorithm;
    }

    /**
     * Renders object to formatted string name: algorithm: message
     * @return {string} The string version of the error.
     */
    public toString(): string {
        return `${this.name}: ${this.algorithm}: ${this.message}`;
    }
}
