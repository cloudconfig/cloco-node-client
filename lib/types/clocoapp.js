/**
 *    clocoapp.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 *   class ClocoApp
 *   Represents an application that is being configured in CloCo.
 */
class ClocoApp {
    /**
     * Initializes a new isntance of the ClocoApp class.
     * @return {[ClocoApp]} ClocoApp
     */
    constructor() {
        this.coreDetails = new ClocoAppCoreDetails();
        this.displayIndex = 0;
        this.environments = new Array();
        this.revisionNumber = 0;
        this.configObjects = new Array();
    }
}
exports.ClocoApp = ClocoApp;
/**
 *   class Environment
 *   Represents an environment into which an application is being configured.
 */
class Environment {
}
exports.Environment = Environment;
/**
 *   class ConfigObject
 *   Represents a configuration object, i.e. a discrete configuration document.
 */
class ConfigObject {
}
exports.ConfigObject = ConfigObject;
/**
 *   class ClocoAppCoreDetails
 *   Describes the core details of a cloco app.
 */
class ClocoAppCoreDetails {
}
exports.ClocoAppCoreDetails = ClocoAppCoreDetails;
/**
 *   class ConfigObjectHeader
 *   Configuration object header information.
 */
class ConfigObjectHeader {
}
exports.ConfigObjectHeader = ConfigObjectHeader;
/**
 *   class ConfigObjectWrapper
 *   Configuration data that can be serialized.
 */
class ConfigObjectWrapper extends ConfigObjectHeader {
}
exports.ConfigObjectWrapper = ConfigObjectWrapper;
