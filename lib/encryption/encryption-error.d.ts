/// <reference types="node" />
/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 * Class that represents an error in an encryption error.
 */
export declare class EncryptionError extends Error {
    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    name: string;
    /**
     * Encryption algorithm.
     * @type {number}
     */
    algorithm: string;
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(message: string, algorithm: string);
    /**
     * Renders object to formatted string name: algorithm: message
     * @return {string} The string version of the error.
     */
    toString(): string;
}
