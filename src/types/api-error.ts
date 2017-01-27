/**
 *   api-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 * Class that represents an error in an api error.
 */
export class ApiError extends Error {

    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    public name: string = "ApiError";

    /**
     * Subscription identifier.
     * @type {number}
     */
    public subscriptionIdentifier: string;

    /**
     * Application identifier.
     * @type {number}
     */
    public applicationIdentifier: string;

    /**
     * Configuration identifier.
     * @type {number}
     */
    public objectIdentifier: string;

    /**
     * Environment identifier.
     * @type {number}
     */
    public environmentIdentifier: string;

    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(
        message: string,
        subscriptionIdentifier: string,
        applicationIdentifier: string,
        objectIdentifier?: string,
        environmentIdentifier?: string) {

        super(message);
        this.message = message;
        this.subscriptionIdentifier = subscriptionIdentifier;
        this.applicationIdentifier = applicationIdentifier;
        this.objectIdentifier = objectIdentifier;
        this.environmentIdentifier = environmentIdentifier;
    }
}
