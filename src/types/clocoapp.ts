/**
 *    clocoapp.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 *   class ClocoApp
 *   Represents an application that is being configured in CloCo.
 */
export class ClocoApp {

    /**
     * The subscription identifier to which the application belongs.
     * @type {string}
     */
    public subscriptionIdentifier: string;

    /**
     * The application identifier.  Must be unique within a subscription.
     * @type {string}
     */
    public applicationIdentifier: string;

    /**
     * The core details of the appplication.
     * @type {ClocoAppCoreDetails}
     */
    public coreDetails: ClocoAppCoreDetails;

    /**
     * The date the app was created.
     * @type {Date}
     */
    public created: Date;

    /**
     * The first user to save the app.
     * @type {string}
     */
    public createdBy: string;

    /**
     * The display order that is imposed on the app.
     * @type {number}
     */
    public displayIndex: number;

    /**
     * The environments associated with the app.
     * @type {Environment[]}
     */
    public environments: Environment[];

    /**
     * The last update of the app.
     * @type {Date}
     */
    public lastUpdated: Date;

    /**
     * The user making the last update.
     * @type {string}
     */
    public lastUpdatedBy: string;

    /**
     * The revision number, used for optimistic concurrency.
     * @type {number}
     */
    public revisionNumber: number;

    /**
     * The config objects associated with the app.
     * @type {ConfigObject[]}
     */
    public configObjects: ConfigObject[];

    /**
     * Initializes a new isntance of the ClocoApp class.
     * @return {[ClocoApp]} ClocoApp
     */
    constructor() {
        this.coreDetails = new ClocoAppCoreDetails();
        this.displayIndex = 0;
        this.environments = new Array<Environment>();
        this.revisionNumber = 0;
        this.configObjects = new Array<ConfigObject>();
    }
}

/**
 * Template key, used instead of environment.
 * @type {string}
 */
export const templateKey: string = "__template";

/**
 * Schema key, used instead of environment.
 * @type {string}
 */
export const schemaKey: string = "__schema";

/**
 *   class Environment
 *   Represents an environment into which an application is being configured.
 */
export class Environment {
    /**
     * The identifier of the environment.  Must beunique within an application.
     * @type {string}
     */
    public environmentIdentifier: string;

    /**
     * The human-friendly name of the environment.
     * @type {string}
     */
    public environmentName: string;

    /**
     * The description of the environment.
     * @type {string}
     */
    public description: string;

    /**
     * Indicates whether the environment is the default one for use in the app.
     * @type {boolean}
     */
    public isDefault: boolean;
}

/**
 *   class ConfigObject
 *   Represents a configuration object, i.e. a discrete configuration document.
 */
export class ConfigObject {
    /**
     * The identifier of the config object.  Must be unique within the app.
     * @type {string}
     */
    public objectIdentifier: string;

    /**
     * The name of the config object.
     * @type {string}
     */
    public objectName: string;

    /**
     * The description of the config object.
     * @type {string}
     */
    public description: string;

    /**
     * The format of the config data.
     * @type {string}
     */
    public format: string;

    /**
     * Marks whether the section should be encrypted or plain.
     * @type {boolean}
     */
    public encrypted: boolean;
}

/**
 *   class ClocoAppCoreDetails
 *   Describes the core details of a cloco app.
 */
export class ClocoAppCoreDetails {
    /**
     * The name of the application.
     * @type {string}
     */
    public applicationName: string;

    /**
     * The description of the application.
     * @type {string}
     */
    public description: string;

    /**
     * Indicates whether this is the default app in the subscription.
     * @type {boolean}
     */
    public isDefault: boolean;
}

/**
 *   class ConfigObjectHeader
 *   Configuration object header information.
 */
export class ConfigObjectHeader {
    /**
     * The subscription identifier.
     * @type {string}
     */
    public subscriptionIdentifier: string;

    /**
     * The application identifier.
     * @type {string}
     */
    public applicationIdentifier: string;

    /**
     * The config object identifier.
     * @type {string}
     */
    public objectIdentifier: string;

    /**
     * The environment identifier.
     * @type {string}
     */
    public environmentIdentifier: string;

    /**
     * The revision number, used for optimistic concurrency checking.
     * @type {number}
     */
    public revisionNumber: number;

    /**
     * The content length of the message.
     * @type {number}
     */
    public contentLength: number;

    /**
     * The created date.
     * @type {Date}
     */
    public created: Date;

    /**
     * The user that created the configuration.
     * @type {string}
     */
    public createdBy: string;

    /**
     * The last updated date.
     * @type {Date}
     */
    public lastUpdated: Date;

    /**
     * The last updated by.
     * @type {Date}
     */
    public lastUpdatedBy: string;

    /**
     * A note of how the version was saved.
     * @type {string}
     */
    public versionNote: string;
}

/**
 *   class ConfigObjectWrapper
 *   Configuration data that can be serialized.
 */
export class ConfigObjectWrapper extends ConfigObjectHeader {

    /**
     * The configuration data.  Can be anything.
     * @type {any}
     */
    public configurationData: any;
}
