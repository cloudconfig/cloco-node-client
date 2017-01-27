/// <reference types="node" />
/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 * Class that represents an error with the settings.
 */
export declare class SettingsError extends Error {
    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    name: string;
    /**
     * Encryption setting.
     * @type {number}
     */
    setting: string;
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {string} setting Initialize error setting to this
     */
    constructor(message: string, setting: string);
    /**
     * Renders object to formatted string name: setting: message
     * @return {string} The string version of the error.
     */
    toString(): string;
}
