/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 * Class that represents an error with the settings.
 */
export class SettingsError extends Error {

    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    public name: string = "SettingsError";

    /**
     * Encryption setting.
     * @type {number}
     */
    public setting: string;

    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} setting Initialize error setting to this
     */
    constructor(message: string, setting: string) {
        super(message);
        this.message = message;
        this.setting = setting;
    }

    /**
     * Renders object to formatted string name: setting: message
     * @return {string} The string version of the error.
     */
    public toString(): string {
        return `${this.name}: ${this.setting}: ${this.message}`;
    }
}
