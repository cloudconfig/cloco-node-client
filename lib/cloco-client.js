"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
/**
 *   cloco-client.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Cloco client, used to retrieve configuration data.
 */
const cache_1 = require("./cache/cache");
const logger_1 = require("./logging/logger");
const api_client_1 = require("./api-client");
const settings_1 = require("./settings");
const settings_error_1 = require("./settings-error");
const encoding_1 = require("./encoding/encoding");
const event_dispatcher_1 = require("./events/event-dispatcher");
/**
 * Class ClocoClient
 *
 * A class that connects to cloco to retrieve configuration.
 */
class ClocoClient {
    constructor(options) {
        this.onConfigurationLoaded = new event_dispatcher_1.EventDispatcher();
        this.onCacheExpired = new event_dispatcher_1.EventDispatcher();
        this.onError = new event_dispatcher_1.EventDispatcher();
        try {
            this.options = options;
            // initialize components.
            logger_1.Logger.init(this.options);
            cache_1.Cache.init();
            this.onCacheExpired.subscribe((client, item) => {
                this.loadConfigurationObjectWrapperFromApi(item.key);
            });
            // set default values.
            settings_1.Settings.setDefaults(this.options);
        }
        catch (e) {
            logger_1.Logger.log.error(e, "ClocoClient()");
            throw e;
        }
    }
    /**
     * Initializes the client.  Loads the application and configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug("ClocoClient.init: start.");
            try {
                // load application.
                yield this.initializeApplication();
                // verify the configured environment.
                if (!this.environmentExists(this.options.environment)) {
                    logger_1.Logger.log.error(`ClocoClient.init: The environment ${this.options.environment} does not exist in application.`);
                    throw new settings_error_1.SettingsError(`The environment '${this.options.environment}' does not exist in application.`, "this.options.environment");
                }
                // load the configuration from the api
                yield this.initializeConfiguration();
                // check for timeouts on the cache.
                if (this.options.cacheCheckInterval > 0) {
                    this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
                }
                logger_1.Logger.log.debug("ClocoClient.init: initialization complete.");
            }
            catch (e) {
                this.onError.dispatch(this, e);
                logger_1.Logger.log.error(e, "ClocoClient.init");
                throw e;
            }
        });
    }
    /**
     * Gets the item from the cache.
     */
    get(objectId) {
        logger_1.Logger.log.debug(`ClocoClient.get: retrieving object '${objectId}'.`);
        if (cache_1.Cache.current.exists(objectId)) {
            logger_1.Logger.log.debug(`ClocoClient.get: object '${objectId}' found in cache.  Returning.`);
            let item = cache_1.Cache.current.get(objectId);
            return item.value;
        }
        else {
            logger_1.Logger.log.debug(`ClocoClient.get: object '${objectId}' not found in cache.`);
            return undefined;
        }
    }
    /**
     * Puts an item into cloco.
     * @type {string}
     */
    put(objectId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`ClocoClient.put: writing object '${objectId}'.`);
            // first, write to the API.
            logger_1.Logger.log.debug(`ClocoClient.put: writing object '${objectId}' to cloco API.`);
            let data = this.encodeAndEncrypt(objectId, item);
            let wrapper = yield api_client_1.ApiClient.putConfigObject(this.options, objectId, data);
            logger_1.Logger.log.debug(`ClocoClient.put: finished api call for '${objectId}'.`, { data: wrapper }, { format: typeof wrapper });
            // then put the item in cache.
            logger_1.Logger.log.debug(`ClocoClient.put: adding object '${objectId}' to cache.`);
            cache_1.Cache.current.addItem(objectId, item, wrapper.revisionNumber, this.options.ttl);
        });
    }
    /**
     * Checks for cache timeouts.  Can be run from the timer or invoked by the parent application.
     */
    checkCacheTimeouts() {
        logger_1.Logger.log.debug(`ClocoClient.checkCacheTimeouts: start.`);
        for (let i = 0; i < cache_1.Cache.current.items.length; i++) {
            if (cache_1.Cache.current.items[i].isExpired()) {
                logger_1.Logger.log.debug(`ClocoClient.checkCacheTimeouts: cache expired for item '${cache_1.Cache.current.items[i].key}'.`, { data: cache_1.Cache.current.items[i] });
                this.onCacheExpired.dispatch(this, cache_1.Cache.current.items[i]);
            }
        }
        logger_1.Logger.log.debug(`ClocoClient.checkCacheTimeouts: complete.`);
        // restart the timer.
        if (this.options.cacheCheckInterval > 0) {
            this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
        }
    }
    /**
     * Loads the cloco application.
     * @return {Promise<void>} A promise of the work completing.
     */
    initializeApplication() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`ClocoClient.initializeApplication: start.`);
            try {
                this.app = yield api_client_1.ApiClient.getApplication(this.options);
            }
            catch (e) {
                logger_1.Logger.log.error(e, "ClocoClient.initializeApplication: error encountered.");
                throw e;
            }
            logger_1.Logger.log.debug(`ClocoClient.initializeApplication: complete.`);
        });
    }
    /**
     * Load the configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    initializeConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`ClocoClient.initializeConfiguration: start.`);
            for (let i = 0; i < this.app.configObjects.length; i++) {
                logger_1.Logger.log.debug(`ClocoClient.initializeConfiguration: Requesting configuration item '${this.app.configObjects[i].objectIdentifier}'.`);
                yield this.loadConfigurationObjectWrapperFromApi(this.app.configObjects[i].objectIdentifier, true);
            }
            logger_1.Logger.log.debug(`ClocoClient.initializeConfiguration: complete.`);
        });
    }
    /**
     * Loads the single configuration object from the server.
     * @param  {string}        objectId     The object identifier.
     * @param  {boolean}       failOnError  Indicates that an error should be raised if an error is encountered.
     * @return {Promise<void>}              A promise of the work completing.
     */
    loadConfigurationObjectWrapperFromApi(objectId, failOnError) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: start.`);
            try {
                logger_1.Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: Checking bearer token.`);
                logger_1.Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: Requesting configuration item '${objectId}'.`);
                let wrapper = yield api_client_1.ApiClient.getConfigObject(this.options, objectId);
                logger_1.Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: Received configuration item '${objectId}'.`, wrapper);
                logger_1.Logger.log.debug(
                // tslint:disable-next-line:max-line-length
                `ClocoClient.loadConfigurationObjectWrapperFromApi: Configuration item '${objectId}' type is '${typeof wrapper.configurationData}'.`, wrapper);
                let item = cache_1.Cache.current.addItem(wrapper.objectIdentifier, this.decryptAndDecode(wrapper), wrapper.revisionNumber, this.options.ttl);
                if (item) {
                    logger_1.Logger.log.debug("ClocoClient.loadConfigurationObjectWrapperFromApi: Dispatching item.");
                    this.onConfigurationLoaded.dispatch(this, item);
                }
                else {
                    logger_1.Logger.log.debug("ClocoClient.loadConfigurationObjectWrapperFromApi: No item to dispatch.");
                }
            }
            catch (e) {
                this.onError.dispatch(this, e);
                logger_1.Logger.log.error(e, "ClocoClient.loadConfigurationObjectWrapperFromApi");
                if (failOnError) {
                    throw e;
                }
            }
            logger_1.Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: complete.`);
        });
    }
    /**
     * Checks to see if the environment exists.
     * @param {string} environmentId A value indicating that the environment exists.
     */
    environmentExists(environmentId) {
        logger_1.Logger.log.debug(`ClocoClient.environmentExists: start. Searching for '${environmentId}'.`);
        if (!this.app || !this.app.environments || !environmentId) {
            logger_1.Logger.log.debug("ClocoClient.environmentExists: data not available, returning false.");
            return false;
        }
        for (let i = 0; i < this.app.environments.length; i++) {
            logger_1.Logger.log.debug(this.app.environments[i], "ClocoClient.environmentExists: object found.");
            if (this.app.environments[i].environmentIdentifier === environmentId) {
                return true;
            }
        }
        logger_1.Logger.log.debug("ClocoClient.environmentExists: environment not found, returning false.");
        return false;
    }
    /**
     * Retrieves the config object metadata from the application.
     * @param  {string}       objectId The object identifier.
     * @return {ConfigObject}          The congif object metadata.
     */
    getConfigObjectMetadata(objectId) {
        logger_1.Logger.log.debug(`ClocoClient.getConfigObjectMetadata: start. Searching for '${objectId}'.`);
        if (!this.app || !this.app.configObjects) {
            logger_1.Logger.log.debug("ClocoClient.getConfigObjectMetadata: app not available, returning undefined.");
            return undefined;
        }
        else {
            for (let i = 0; i < this.app.configObjects.length; i++) {
                if (this.app.configObjects[i].objectIdentifier === objectId) {
                    logger_1.Logger.log.debug(this.app.configObjects[i], "ClocoClient.getConfigObjectMetadata: object found.");
                    return this.app.configObjects[i];
                }
            }
        }
        logger_1.Logger.log.debug("ClocoClient.getConfigObjectMetadata: object not found, returning undefined.");
        return undefined;
    }
    /**
     * Encodes and encrypts an item ready to send to the API.
     * @param  {string} objectId The object identifier.
     * @param  {any}    item     The item to send.
     * @return {any}             The encoded and encrypted item.
     */
    encodeAndEncrypt(objectId, item) {
        logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: processing object '${objectId}'.`);
        // retrieve the config object metadata.
        let configObject = this.getConfigObjectMetadata(objectId);
        if (!configObject) {
            logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: config object metadata for '${objectId}' not found in application.`, this.app);
            throw new Error(`Config object metadata for '${objectId}' not found in application.`);
        }
        // check if the data is encrypted.
        let data;
        if (this.options.useEncryption) {
            let encoder = encoding_1.Encoding.getEncoder(configObject.format);
            logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: encoding object '${objectId}' in format '${configObject.format}'.`);
            let encoded = encoder.encode(item);
            logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: encrypting object '${objectId}'.`);
            data = this.options.encryptor.encrypt(encoded);
            logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: object '${objectId}' encoded and encrypted.`, { data: data });
        }
        else {
            // if not encrypted, pass straight through.
            logger_1.Logger.log.debug(`ClocoClient.encodeAndEncrypt: object '${objectId}' not encrypted, passing through.`, { data: item });
            data = item;
        }
        return data;
    }
    /**
     * Decrypts and decodes the config object wrapper.
     * @param  {ConfigObjectWrapper} wrapper The config object wrapper.
     * @return {any}                         The decoded data.
     */
    decryptAndDecode(wrapper) {
        logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: processing object '${wrapper.objectIdentifier}'.`);
        // retrieve the config object metadata.
        let configObject = this.getConfigObjectMetadata(wrapper.objectIdentifier);
        if (!configObject) {
            logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: config object metadata for '${wrapper.objectIdentifier}' not found in application.`, this.app);
            throw new Error(`Config object metadata for '${wrapper.objectIdentifier}' not found in application.`);
        }
        // check if the data is encrypted.
        let data;
        if (this.options.useEncryption) {
            logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: decrypting object '${wrapper.objectIdentifier}'.`);
            let decrypted = this.options.encryptor.decrypt(wrapper.configurationData);
            logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: decoding object '${wrapper.objectIdentifier}' to format '${configObject.format}'.`);
            let encoder = encoding_1.Encoding.getEncoder(configObject.format);
            data = encoder.decode(decrypted);
            logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' decrypted and decoded.`, { data: data });
        }
        else {
            // if not encrypted, pass straight through.
            logger_1.Logger.log.debug(`ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' not encrypted, passing through.`, { data: wrapper.configurationData });
            data = wrapper.configurationData;
        }
        return data;
    }
}
exports.ClocoClient = ClocoClient;
