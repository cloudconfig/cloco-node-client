/**
 *   api-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 * Class that represents an error in an api error.
 */
class ApiError extends Error {
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(message, subscriptionIdentifier, applicationIdentifier, objectIdentifier, environmentIdentifier) {
        super(message);
        /**
         * Descriptive name of the Error.
         * @type {string}
         */
        this.name = "ApiError";
        this.message = message;
        this.subscriptionIdentifier = subscriptionIdentifier;
        this.applicationIdentifier = applicationIdentifier;
        this.objectIdentifier = objectIdentifier;
        this.environmentIdentifier = environmentIdentifier;
    }
}
exports.ApiError = ApiError;
