/**
 *    clocoapp.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   class ClocoApp
 *   Represents an application that is being configured in CloCo.
 */
export declare class ClocoApp {
    /**
     * The subscription identifier to which the application belongs.
     * @type {string}
     */
    subscriptionIdentifier: string;
    /**
     * The application identifier.  Must be unique within a subscription.
     * @type {string}
     */
    applicationIdentifier: string;
    /**
     * The core details of the appplication.
     * @type {ClocoAppCoreDetails}
     */
    coreDetails: ClocoAppCoreDetails;
    /**
     * The date the app was created.
     * @type {Date}
     */
    created: Date;
    /**
     * The first user to save the app.
     * @type {string}
     */
    createdBy: string;
    /**
     * The display order that is imposed on the app.
     * @type {number}
     */
    displayIndex: number;
    /**
     * The environments associated with the app.
     * @type {Environment[]}
     */
    environments: Environment[];
    /**
     * The last update of the app.
     * @type {Date}
     */
    lastUpdated: Date;
    /**
     * The user making the last update.
     * @type {string}
     */
    lastUpdatedBy: string;
    /**
     * The revision number, used for optimistic concurrency.
     * @type {number}
     */
    revisionNumber: number;
    /**
     * The config objects associated with the app.
     * @type {ConfigObject[]}
     */
    configObjects: ConfigObject[];
    /**
     * Initializes a new isntance of the ClocoApp class.
     * @return {[ClocoApp]} ClocoApp
     */
    constructor();
}
/**
 *   class Environment
 *   Represents an environment into which an application is being configured.
 */
export declare class Environment {
    /**
     * The identifier of the environment.  Must beunique within an application.
     * @type {string}
     */
    environmentIdentifier: string;
    /**
     * The human-friendly name of the environment.
     * @type {string}
     */
    environmentName: string;
    /**
     * The description of the environment.
     * @type {string}
     */
    description: string;
    /**
     * Indicates whether the environment is the default one for use in the app.
     * @type {boolean}
     */
    isDefault: boolean;
}
/**
 *   class ConfigObject
 *   Represents a configuration object, i.e. a discrete configuration document.
 */
export declare class ConfigObject {
    /**
     * The identifier of the config object.  Must be unique within the app.
     * @type {string}
     */
    objectIdentifier: string;
    /**
     * The name of the config object.
     * @type {string}
     */
    objectName: string;
    /**
     * The description of the config object.
     * @type {string}
     */
    description: string;
    /**
     * The format of the config data.
     * @type {string}
     */
    format: string;
    /**
     * Marks whether the section should be encrypted or plain.
     * @type {boolean}
     */
    encrypted: boolean;
}
/**
 *   class ClocoAppCoreDetails
 *   Describes the core details of a cloco app.
 */
export declare class ClocoAppCoreDetails {
    /**
     * The name of the application.
     * @type {string}
     */
    applicationName: string;
    /**
     * The description of the application.
     * @type {string}
     */
    description: string;
    /**
     * Indicates whether this is the default app in the subscription.
     * @type {boolean}
     */
    isDefault: boolean;
}
/**
 *   class ConfigObjectHeader
 *   Configuration object header information.
 */
export declare class ConfigObjectHeader {
    /**
     * The subscription identifier.
     * @type {string}
     */
    subscriptionIdentifier: string;
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
     * The user that created the configuration.
     * @type {string}
     */
    createdBy: string;
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
}
/**
 *   class ConfigObjectWrapper
 *   Configuration data that can be serialized.
 */
export declare class ConfigObjectWrapper extends ConfigObjectHeader {
    /**
     * The configuration data.  Can be anything.
     * @type {any}
     */
    configurationData: any;
}
