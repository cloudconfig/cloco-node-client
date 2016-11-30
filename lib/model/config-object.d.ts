/**
 *    config-object.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   class ConfigObject
 *   Configuration object.
 */
export declare class ConfigObject<T> {
    /**
     * The application identifier.
     * @type {string}
     */
    applicationIdentifier: string;
    /**
     * The config object identifier.
     * @type {string}
     */
    objectIdentifier: string;
    /**
     * The environment identifier.
     * @type {string}
     */
    environmentIdentifier: string;
    /**
     * The revision number, used for optimistic concurrency checking.
     * @type {number}
     */
    revisionNumber: number;
    /**
     * The content length of the message.
     * @type {number}
     */
    contentLength: number;
    /**
     * The created date.
     * @type {Date}
     */
    created: Date;
    /**
     * The last updated date.
     * @type {Date}
     */
    lastUpdated: Date;
    /**
     * The last updated by.
     * @type {Date}
     */
    lastUpdatedBy: string;
    /**
     * A note of how the version was saved.
     * @type {string}
     */
    versionNote: string;
    /**
     * The configuration data.  Can be anything.
     * @type {any}
     */
    configurationData: T;
}
