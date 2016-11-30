/**
 *   encryption-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 * Class that represents an error with the settings.
 */
class SettingsError extends Error {
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} setting Initialize error setting to this
     */
    constructor(message, setting) {
        super(message);
        /**
         * Descriptive name of the Error.
         * @type {string}
         */
        this.name = "SettingsError";
        this.message = message;
        this.setting = setting;
    }
    /**
     * Renders object to formatted string name: setting: message
     * @return {string} The string version of the error.
     */
    toString() {
        return `${this.name}: ${this.setting}: ${this.message}`;
    }
}
exports.SettingsError = SettingsError;
