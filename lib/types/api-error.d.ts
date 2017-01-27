/// <reference types="node" />
/**
 *   api-error.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 * Class that represents an error in an api error.
 */
export declare class ApiError extends Error {
    /**
     * Descriptive name of the Error.
     * @type {string}
     */
    name: string;
    /**
     * Subscription identifier.
     * @type {number}
     */
    subscriptionIdentifier: string;
    /**
     * Application identifier.
     * @type {number}
     */
    applicationIdentifier: string;
    /**
     * Configuration identifier.
     * @type {number}
     */
    objectIdentifier: string;
    /**
     * Environment identifier.
     * @type {number}
     */
    environmentIdentifier: string;
    /**
     * constructor
     * @param  {string} message Initialize error message to this
     * @param  {number} code Initialize algorithm to this
     */
    constructor(message: string, subscriptionIdentifier: string, applicationIdentifier: string, objectIdentifier?: string, environmentIdentifier?: string);
}
