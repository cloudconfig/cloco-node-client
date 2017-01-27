/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 * Class that represents an error in an encryption error.
 */
class EncryptionError extends Error {
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(message, algorithm) {
        super(message);
        /**
         * Descriptive name of the Error.
         * @type {string}
         */
        this.name = "EncryptionError";
        this.message = message;
        this.algorithm = algorithm;
    }
    /**
     * Renders object to formatted string name: algorithm: message
     * @return {string} The string version of the error.
     */
    toString() {
        return `${this.name}: ${this.algorithm}: ${this.message}`;
    }
}
exports.EncryptionError = EncryptionError;
