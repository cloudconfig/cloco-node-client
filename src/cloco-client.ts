/**
 *   cloco-client.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Cloco client, used to retrieve configuration data.
 */
import * as fs from "fs";
import { Cache } from "./cache/cache";
import { CacheItem } from "./cache/cache-item";
import { Logger } from "./logging/logger";
import { ClocoApp, ConfigObjectWrapper, ConfigObject } from "./types/clocoapp";
import { FileSystem } from "./file-system";
import { IOptions } from "./types/ioptions";
import { ApiClient } from "./api-client";
import { Settings } from "./settings";
import { SettingsError } from "./settings-error";
import { IEncoder } from "./encoding/iencoder";
import { Encoding } from "./encoding/encoding";
import { EventDispatcher } from "./events/event-dispatcher";

/**
 * Class ClocoClient
 *
 * A class that connects to cloco to retrieve configuration.
 */
export class ClocoClient {
    public options: IOptions;
    public app: ClocoApp;
    public onConfigurationLoaded: EventDispatcher<ClocoClient, CacheItem> = new EventDispatcher<ClocoClient, CacheItem>();
    public onCacheExpired: EventDispatcher<ClocoClient, CacheItem> = new EventDispatcher<ClocoClient, CacheItem>();
    public onError: EventDispatcher<ClocoClient, Error> = new EventDispatcher<ClocoClient, Error>();
    private timer: NodeJS.Timer;

    constructor(options: IOptions) {

        try {
            this.options = options;

            // initialize components.
            Logger.init(this.options);
            Cache.init();
            this.onCacheExpired.subscribe((client: ClocoClient, item: CacheItem) => {
                this.loadConfigurationObjectWrapperFromApi(item.key);
            });

            // ensure the local cache folder is available
            FileSystem.ensureDirectory(`${FileSystem.getUserHome()}/.cloco/cache`);

            // set default values.
            Settings.setDefaults(this.options);
        } catch (e) {
            Logger.log.error(e, "ClocoClient()");
            throw e;
        }
    }

    /**
     * Initializes the client.  Loads the application and configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    public async init(): Promise<void> {

        Logger.log.debug("ClocoClient.init: start.");

        try {
            // load application.
            await this.initializeApplication();

            // verify the configured environment.
            if (!this.environmentExists(this.options.environment)) {
                Logger.log.error(`ClocoClient.init: The environment ${this.options.environment} does not exist in application.`);
                throw new SettingsError(
                    `The environment '${this.options.environment}' does not exist in application.`, "this.options.environment");
            }

            // load the configuration from the api
            await this.initializeConfiguration();

            // check for timeouts on the cache.
            if (this.options.cacheCheckInterval > 0) {
                this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
            }

            Logger.log.debug("ClocoClient.init: initialization complete.");
        } catch (e) {
            this.onError.dispatch(this, e);
            Logger.log.error(e, "ClocoClient.init");
            throw e;
        }
    }

    /**
     * Gets the item from the cache.
     */
    public get<T>(objectId: string): T {

        Logger.log.debug(`ClocoClient.get: retrieving object '${objectId}'.`);

        if (Cache.current.exists(objectId)) {
            Logger.log.debug(`ClocoClient.get: object '${objectId}' found in cache.  Returning.`);
            let item: CacheItem = Cache.current.get(objectId);
            return item.value as T;
        } else {
            Logger.log.debug(`ClocoClient.get: object '${objectId}' not found in cache.`);
            return undefined;
        }
    }

    /**
     * Puts an item into cloco.
     * @type {string}
     */
    public async put<T>(objectId: string, item: T): Promise<void> {

        Logger.log.debug(`ClocoClient.put: writing object '${objectId}'.`);

        // first, write to the API.
        Logger.log.debug(`ClocoClient.put: writing object '${objectId}' to cloco API.`);
        let data: any = this.encodeAndEncrypt(objectId, item);
        let wrapper: ConfigObjectWrapper = await ApiClient.putConfigObject(this.options, objectId, data);
        Logger.log.debug(`ClocoClient.put: finished api call for '${objectId}'.`, { data: wrapper }, { format: typeof wrapper });

        // then put the item in cache.
        Logger.log.debug(`ClocoClient.put: adding object '${objectId}' to cache.`);
        Cache.current.addItem(objectId, item, wrapper.revisionNumber, this.options.ttl);
    }

    /**
     * Checks for cache timeouts.  Can be run from the timer or invoked by the parent application.
     */
    public checkCacheTimeouts(): void {

        Logger.log.debug(`ClocoClient.checkCacheTimeouts: start.`);

        for (let i: number = 0; i < Cache.current.items.length; i++) {
            if (Cache.current.items[i].isExpired()) {
                Logger.log.debug(
                    `ClocoClient.checkCacheTimeouts: cache expired for item '${Cache.current.items[i].key}'.`,
                    { data: Cache.current.items[i] });
                this.onCacheExpired.dispatch(this, Cache.current.items[i]);
            }
        }

        Logger.log.debug(`ClocoClient.checkCacheTimeouts: complete.`);

        // restart the timer.
        if (this.options.cacheCheckInterval > 0) {
            this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
        }
    }

    /**
     * Loads the cloco application.
     * @return {Promise<void>} A promise of the work completing.
     */
    private async initializeApplication(): Promise<void> {

        Logger.log.debug(`ClocoClient.initializeApplication: start.`);
        let filename: string = `${FileSystem.getUserHome()}/.cloco/cache/application_${this.options.application}`;

        try {
            this.app = await ApiClient.getApplication(this.options);

            // write to disk cache if in options.
            if (this.options.useDiskCaching) {
                Logger.log.debug(`ClocoClient.initializeApplication: writing application ${this.options.application} to disk.`);
                await FileSystem.writeFile(filename, JSON.stringify(this.app));
            }
        } catch (e) {
            Logger.log.error(e, `ClocoClient.initializeApplication: error loading application ${this.options.application}.`);

            // load from disk if in cache
            if (!this.app && this.options.useDiskCaching && fs.existsSync(filename)) {
                Logger.log.debug(`ClocoClient.initializeApplication: loading application ${this.options.application} from disk.`);
                let cached: string = await FileSystem.readFile(filename);
                this.app = JSON.parse(cached);
            } else {
                throw e;
            }
        }

        Logger.log.debug(`ClocoClient.initializeApplication: complete.`);
    }

    /**
     * Load the configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    private async initializeConfiguration(): Promise<void> {

        Logger.log.debug(`ClocoClient.initializeConfiguration: start.`);

        for (let i: number = 0; i < this.app.configObjects.length; i++) {
            Logger.log.debug(
                `ClocoClient.initializeConfiguration: Requesting configuration item '${this.app.configObjects[i].objectIdentifier}'.`);
            await this.loadConfigurationObjectWrapperFromApi(this.app.configObjects[i].objectIdentifier, true);
        }

        Logger.log.debug(`ClocoClient.initializeConfiguration: complete.`);
    }

    /**
     * Loads the single configuration object from the server.
     * @param  {string}        objectId     The object identifier.
     * @param  {boolean}       initializing Indicates that an error should be raised if an error is encountered.
     * @return {Promise<void>}              A promise of the work completing.
     */
    private async loadConfigurationObjectWrapperFromApi(objectId: string, initializing?: boolean): Promise<void> {

        Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: start.`);
        // tslint:disable-next-line:max-line-length
        let filename: string = `${FileSystem.getUserHome()}/.cloco/cache/configuration_${this.options.application}_${objectId}_${this.options.environment}`;
        let wrapper: ConfigObjectWrapper;

        try {
            // load the configuration object wrapper or retrieve from disk cache.
            Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: Requesting configuration item '${objectId}'.`);
            wrapper = await ApiClient.getConfigObject(this.options, objectId);

            Logger.log.debug(
                `ClocoClient.loadConfigurationObjectWrapperFromApi: Received configuration item '${objectId}'.`, wrapper);
            Logger.log.debug(
                // tslint:disable-next-line:max-line-length
                `ClocoClient.loadConfigurationObjectWrapperFromApi: Configuration item '${objectId}' type is '${typeof wrapper.configurationData}'.`,
                wrapper);

            if (this.options.useDiskCaching) {
                Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: writing configuration '${objectId}' to disk.`);
                await FileSystem.writeFile(filename, JSON.stringify(wrapper));
            }
        } catch (e) {
            this.onError.dispatch(this, e);
            Logger.log.error(e, "ClocoClient.loadConfigurationObjectWrapperFromApi: Error encountered loading configuration from api.");
            if (initializing) {
                if (this.options.useDiskCaching && fs.existsSync(filename)) {
                    Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: loading configuration '${objectId}' from disk.`);
                    let cached: string = await FileSystem.readFile(filename);
                    wrapper = JSON.parse(cached);
                } else {
                    throw e;
                }
            } else {
                // the error is dispatched, allow processing to continue.
                return;
            }
        }

        // by this point we either have a config object wrapper or will have exited.
        try {
            let item: CacheItem = Cache.current.addItem(
                wrapper.objectIdentifier, this.decryptAndDecode(wrapper), wrapper.revisionNumber, this.options.ttl);

            if (item) {
                Logger.log.debug("ClocoClient.loadConfigurationObjectWrapperFromApi: Dispatching item.");
                this.onConfigurationLoaded.dispatch(this, item);
            } else {
                Logger.log.debug("ClocoClient.loadConfigurationObjectWrapperFromApi: No item to dispatch.");
            }
        } catch (e) {
            this.onError.dispatch(this, e);
            Logger.log.error(e, "ClocoClient.loadConfigurationObjectWrapperFromApi: error processing configuration data.");
            if (initializing) {
                throw e;
            }
        }

        Logger.log.debug(`ClocoClient.loadConfigurationObjectWrapperFromApi: complete.`);
    }

    /**
     * Checks to see if the environment exists.
     * @param {string} environmentId A value indicating that the environment exists.
     */
    private environmentExists(environmentId: string): boolean {

        Logger.log.debug(`ClocoClient.environmentExists: start. Searching for '${environmentId}'.`);

        if (!this.app || !this.app.environments || !environmentId) {
            Logger.log.debug("ClocoClient.environmentExists: data not available, returning false.");
            return false;
        }

        for (let i: number = 0; i < this.app.environments.length; i++) {
            Logger.log.debug(this.app.environments[i], "ClocoClient.environmentExists: object found.");
            if (this.app.environments[i].environmentIdentifier === environmentId) {
                return true;
            }
        }

        Logger.log.debug("ClocoClient.environmentExists: environment not found, returning false.");
        return false;
    }

    /**
     * Retrieves the config object metadata from the application.
     * @param  {string}       objectId The object identifier.
     * @return {ConfigObject}          The congif object metadata.
     */
    private getConfigObjectMetadata(objectId: string): ConfigObject {

        Logger.log.debug(`ClocoClient.getConfigObjectMetadata: start. Searching for '${objectId}'.`);

        if (!this.app || !this.app.configObjects) {
            Logger.log.debug("ClocoClient.getConfigObjectMetadata: app not available, returning undefined.");
            return undefined;
        } else {
            for (let i: number = 0; i < this.app.configObjects.length; i++) {
                if (this.app.configObjects[i].objectIdentifier === objectId) {
                    Logger.log.debug(this.app.configObjects[i], "ClocoClient.getConfigObjectMetadata: object found.");
                    return this.app.configObjects[i];
                }
            }
        }

        Logger.log.debug("ClocoClient.getConfigObjectMetadata: object not found, returning undefined.");
        return undefined;
    }

    /**
     * Encodes and encrypts an item ready to send to the API.
     * @param  {string} objectId The object identifier.
     * @param  {any}    item     The item to send.
     * @return {any}             The encoded and encrypted item.
     */
    private encodeAndEncrypt(objectId: string, item: any): any {

        Logger.log.debug(`ClocoClient.encodeAndEncrypt: processing object '${objectId}'.`);

        // retrieve the config object metadata.
        let configObject: ConfigObject = this.getConfigObjectMetadata(objectId);
        if (!configObject) {
            Logger.log.debug(`ClocoClient.encodeAndEncrypt: config object metadata for '${objectId}' not found in application.`, this.app);
            throw new Error(`Config object metadata for '${objectId}' not found in application.`);
        }

        // check if the data is encrypted.
        let data: any;
        if (this.options.useEncryption) {
            let encoder: IEncoder = Encoding.getEncoder(configObject.format);

            Logger.log.debug(`ClocoClient.encodeAndEncrypt: encoding object '${objectId}' in format '${configObject.format}'.`);
            let encoded: string = encoder.encode(item);

            Logger.log.debug(`ClocoClient.encodeAndEncrypt: encrypting object '${objectId}'.`);
            data = this.options.encryptor.encrypt(encoded);
            Logger.log.debug(`ClocoClient.encodeAndEncrypt: object '${objectId}' encoded and encrypted.`, { data: data });
        } else {
            // if not encrypted, pass straight through.
            Logger.log.debug(`ClocoClient.encodeAndEncrypt: object '${objectId}' not encrypted, passing through.`, { data: item });
            data = item;
        }

        return data;
    }

    /**
     * Decrypts and decodes the config object wrapper.
     * @param  {ConfigObjectWrapper} wrapper The config object wrapper.
     * @return {any}                         The decoded data.
     */
    private decryptAndDecode(wrapper: ConfigObjectWrapper): any {

        Logger.log.debug(`ClocoClient.decryptAndDecode: processing object '${wrapper.objectIdentifier}'.`);

        // retrieve the config object metadata.
        let configObject: ConfigObject = this.getConfigObjectMetadata(wrapper.objectIdentifier);
        if (!configObject) {
            Logger.log.debug(
                `ClocoClient.decryptAndDecode: config object metadata for '${wrapper.objectIdentifier}' not found in application.`,
                this.app);
            throw new Error(`Config object metadata for '${wrapper.objectIdentifier}' not found in application.`);
        }

        // check if the data is encrypted.
        let data: any;
        if (this.options.useEncryption) {

            Logger.log.debug(`ClocoClient.decryptAndDecode: decrypting object '${wrapper.objectIdentifier}'.`);
            let decrypted: string = this.options.encryptor.decrypt(wrapper.configurationData);

            // tslint:disable-next-line:max-line-length
            Logger.log.debug(`ClocoClient.decryptAndDecode: decoding object '${wrapper.objectIdentifier}' to format '${configObject.format}'.`);
            let encoder: IEncoder = Encoding.getEncoder(configObject.format);
            data = encoder.decode(decrypted);
            Logger.log.debug(
                `ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' decrypted and decoded.`,
                { data: data });
        } else {
            // if not encrypted, pass straight through.
            Logger.log.debug(
                `ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' not encrypted, passing through.`,
                { data: wrapper.configurationData });
            data = wrapper.configurationData;
        }

        return data;
    }
}
