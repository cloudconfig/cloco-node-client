/**
 *   cloco-client.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Cloco client, used to retrieve configuration data.
 */
import { Cache } from "./cache/cache";
import { CacheItem } from "./cache/cache-item";
import { Logger } from "./logging/logger";
import { AccessTokenResponse } from "./types/access-token-response";
import { ClocoApp, ConfigObjectWrapper, ConfigObject } from "./types/clocoapp";
import { IOptions } from "./types/ioptions";
import { ApiClient } from "./api-client";
import { JwtDecoder } from "./jwt-decoder";
import { Settings } from "./settings";
import { SettingsError } from "./settings-error";
import { IEncoder } from "./encoding/iencoder";
import { Encoding } from "./encoding/encoding";
import { IEvent } from "./events/ievent";
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
    public onError: EventDispatcher<ClocoClient, string> = new EventDispatcher<ClocoClient, string>();
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

        // set default values.
        Settings.setDefaults(this.options);

        // check for timeouts on the cache.
        this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
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

      Logger.log.trace("ClocoClient.init: start.");

      try {
        // load application.
        await this.loadApplication();

        // verify the configured environment.
        if (!this.environmentExists(this.options.environment)) {
          Logger.log.error(`ClocoClient.init: The environment ${this.options.environment} does not exist in application.`);
          throw new SettingsError(`The environment ${this.options.environment} does not exist in application.`, "this.options.environment");
        }

        // load the configuration from the api
        await this.loadConfigurationFromApi();

        Logger.log.trace("ClocoClient.init: initialization complete.");
      } catch (e) {
        Logger.log.error(e, "ClocoClient.init");
        throw e;
      }
    }

    /**
     * Gets the item from the cache.
     */
    public get<T>(objectId: string): T {

      Logger.log.trace(`ClocoClient.get: retrieving object '${objectId}'.`);

      if (Cache.current.exists(objectId)) {
        Logger.log.trace(`ClocoClient.get: object '${objectId}' found in cache.  Returning.`);
        return Cache.current.get(objectId) as T;
      } else {
        Logger.log.trace(`ClocoClient.get: object '${objectId}' not found in cache.`);
        return undefined;
      }
    }

    /**
     * Puts an item into cloco.
     * @type {string}
     */
    public async put<T>(objectId: string, item: T): Promise<void> {

      Logger.log.trace(`ClocoClient.put: writing object '${objectId}'.`);

      // first, write to the API.
      Logger.log.trace(`ClocoClient.put: writing object '${objectId}' to cloco API.`);
      let data: any = this.encodeAndEncrypt(objectId, item);
      let wrapper: ConfigObjectWrapper = await ApiClient.putConfigObject(this.options, objectId, data);
      Logger.log.trace(`ClocoClient.put: finished api call for '${objectId}'.`, { data: wrapper }, { format: typeof wrapper });

      // then put the item in cache.
      Logger.log.trace(`ClocoClient.put: adding object '${objectId}' to cache.`);
      Cache.current.addItem(objectId, item, wrapper.revisionNumber, this.options.ttl);
    }

    /**
     * Loads the cloco application.
     * @return {Promise<void>} A promise of the work completing.
     */
    private async loadApplication(): Promise<void> {

      Logger.log.trace(`ClocoClient.loadApplication: start.`);

      try {
        await this.checkBearerToken();
        this.app = await ApiClient.getApplication(this.options);
      } catch (e) {
        this.onError.dispatch(this, e.message);
        Logger.log.error(e, "ClocoClient.loadApplication: error encountered.");
      }

      Logger.log.trace(`ClocoClient.loadApplication: complete.`);
    }

    /**
     * Load the configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    private async loadConfigurationFromApi(): Promise<void> {

      Logger.log.trace(`ClocoClient.loadConfigurationFromApi: start.`);

      for (let i: number = 0; i < this.app.configObjects.length; i++) {
       Logger.log.trace(
         `ClocoClient.loadConfigurationFromApi: Requesting configuration item '${this.app.configObjects[i].objectIdentifier}'.`);
       await this.loadConfigurationObjectWrapperFromApi(this.app.configObjects[i].objectIdentifier);
      }

      Logger.log.trace(`ClocoClient.loadConfigurationFromApi: complete.`);
    }

    /**
     * Loads the single configuration object from the server.
     * @param  {string}        objectId The object identifier.
     * @return {Promise<void>}          A promise of the work completing.
     */
    private async loadConfigurationObjectWrapperFromApi(objectId: string): Promise<void> {

      Logger.log.trace(`ClocoClient.loadConfigurationObjectWrapperFromApi: start.`);

      try {

        Logger.log.trace(`ClocoClient.loadConfigurationObjectWrapperFromApi: Checking bearer token.`);
        await this.checkBearerToken();

        Logger.log.trace(`ClocoClient.loadConfigurationObjectWrapperFromApi: Requesting configuration item '${objectId}'.`);
        let wrapper: ConfigObjectWrapper = await ApiClient.getConfigObject(this.options, objectId);
        Logger.log.trace(
          `ClocoClient.loadConfigurationObjectWrapperFromApi: Received configuration item '${objectId}'.`, wrapper);
        Logger.log.trace(
          // tslint:disable-next-line:max-line-length
          `ClocoClient.loadConfigurationObjectWrapperFromApi: Configuration item '${objectId}' type is '${typeof wrapper.configurationData}'.`,
          wrapper);

        let item: CacheItem = Cache.current.addItem(
          wrapper.objectIdentifier, this.decryptAndDecode(wrapper), wrapper.revisionNumber, this.options.ttl);

        if (item) {
          this.onConfigurationLoaded.dispatch(this, item);
        }
      } catch (e) {
        this.onError.dispatch(this, objectId);
        Logger.log.error(e, "ClocoClient.loadConfigurationObjectWrapperFromApi");
      }

      Logger.log.trace(`ClocoClient.loadConfigurationObjectWrapperFromApi: complete.`);
    }

    /**
     * Checks for cache timeouts.
     */
    private checkCacheTimeouts(): void {

      Logger.log.trace(`ClocoClient.checkCacheTimeouts: start.`);

      for (let i: number = 0; i < Cache.current.items.length; i++) {
        if (Cache.current.items[i].isExpired()) {
          Logger.log.trace(
            `ClocoClient.checkCacheTimeouts: cache expired for item '${Cache.current.items[i].key}'.`, {data: Cache.current.items[i]});
          this.onCacheExpired.dispatch(this, Cache.current.items[i]);
        }
      }

      Logger.log.trace(`ClocoClient.checkCacheTimeouts: complete.`);
      this.timer = setTimeout(() => this.checkCacheTimeouts(), this.options.cacheCheckInterval);
    }

    /**
     * Checks the bearer token for expiry and, if expired, refreshes.
     * @return {Promise<void>} A promise of the work completing.
     */
    private async checkBearerToken(): Promise<void> {

      Logger.log.trace(`ClocoClient.checkBearerToken: start.`);

      try {
        if (JwtDecoder.bearerTokenExpired(this.options.tokens.accessToken)) {

          Logger.log.trace(`ClocoClient.checkBearerToken: bearer token has expired and will be refreshed.`);

          let response: AccessTokenResponse;
          if (this.options.credentials) {
            response = await ApiClient.getAccessTokenFromClientCredentials(this.options);
          } else {
            response = await ApiClient.getAccessTokenFromRefreshToken(this.options);
          }
          this.options.tokens.accessToken = response.access_token;
          Settings.storeBearerToken(response.access_token);
        }
      } catch (e) {
        this.onError.dispatch(this, e.message);
        Logger.log.error(e, "ClocoClient.checkBearerToken: error encountered.");
      }

      Logger.log.trace(`ClocoClient.checkBearerToken: complete.`);
    }

    /**
     * Checks to see if the environment exists.
     * @param {string} environmentId A value indicating that the environment exists.
     */
    private environmentExists(environmentId: string): boolean {

      Logger.log.trace(`ClocoClient.environmentExists: start. Searching for '${environmentId}'.`);

      if (!this.app || !this.app.environments || !environmentId) {
        Logger.log.trace("ClocoClient.environmentExists: data not available, returning false.");
        return false;
      }

      for (let i: number = 0; i < this.app.environments.length; i++) {
        Logger.log.trace(this.app.environments[i], "ClocoClient.environmentExists: object found.");
        if (this.app.environments[i].environmentIdentifier === environmentId) {
          return true;
        }
      }

      Logger.log.trace("ClocoClient.environmentExists: environment not found, returning false.");
      return false;
    }

    /**
     * Retrieves the config object metadata from the application.
     * @param  {string}       objectId The object identifier.
     * @return {ConfigObject}          The congif object metadata.
     */
    private getConfigObject(objectId: string): ConfigObject {

      Logger.log.trace(`ClocoClient.getConfigObject: start. Searching for '${objectId}'.`);

      if (!this.app || !this.app.configObjects) {
        Logger.log.trace("ClocoClient.getConfigObject: app not available, returning undefined.");
        return undefined;
      } else {
        for (let i: number = 0; i < this.app.configObjects.length; i++) {
          if (this.app.configObjects[i].objectIdentifier === objectId) {
            Logger.log.trace(this.app.configObjects[i], "ClocoClient.getConfigObject: object found.");
            return this.app.configObjects[i];
          }
        }
      }

      Logger.log.trace("ClocoClient.getConfigObject: object not found, returning undefined.");
      return undefined;
    }

    /**
     * Encodes and encrypts an item ready to send to the API.
     * @param  {string} objectId The object identifier.
     * @param  {any}    item     The item to send.
     * @return {any}             The encoded and encrypted item.
     */
    private encodeAndEncrypt(objectId: string, item: any): any {

      Logger.log.trace(`ClocoClient.encodeAndEncrypt: processing object '${objectId}'.`);

      // retrieve the config object metadata.
      let configObject: ConfigObject = this.getConfigObject(objectId);
      if (!configObject) {
          Logger.log.trace(`ClocoClient.encodeAndEncrypt: config object metadata for '${objectId}' not found in application.`, this.app);
          throw new Error(`Config object metadata for '${objectId}' not found in application.`);
      }

      // check if the data is encrypted.
      let data: any;
      if (configObject.encrypted) {
        let encoder: IEncoder = Encoding.getEncoder(configObject.format);

        Logger.log.trace(`ClocoClient.encodeAndEncrypt: encoding object '${objectId}' in format '${configObject.format}'.`);
        let encoded: string = encoder.encode(item);

        Logger.log.trace(`ClocoClient.encodeAndEncrypt: encrypting object '${objectId}'.`);
        data = this.options.encryptor.encrypt(encoded);
        Logger.log.trace(`ClocoClient.encodeAndEncrypt: object '${objectId}' encoded and encrypted.`, {data: data});
      } else {
        // if not encrypted, pass straight through.
        Logger.log.trace(`ClocoClient.encodeAndEncrypt: object '${objectId}' not encrypted, passing through.`, {data: item});
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

      Logger.log.trace(`ClocoClient.decryptAndDecode: processing object '${wrapper.objectIdentifier}'.`);

      // retrieve the config object metadata.
      let configObject: ConfigObject = this.getConfigObject(wrapper.objectIdentifier);
      if (!configObject) {
          Logger.log.trace(
            `ClocoClient.decryptAndDecode: config object metadata for '${wrapper.objectIdentifier}' not found in application.`, this.app);
          throw new Error(`Config object metadata for '${wrapper.objectIdentifier}' not found in application.`);
      }

      // check if the data is encrypted.
      let data: any;
      if (configObject.encrypted) {

        Logger.log.trace(`ClocoClient.decryptAndDecode: decrypting object '${wrapper.objectIdentifier}'.`);
        let decrypted: string = this.options.encryptor.decrypt(wrapper.configurationData);

        Logger.log.trace(`ClocoClient.decryptAndDecode: decoding object '${wrapper.objectIdentifier}' to format '${configObject.format}'.`);
        let encoder: IEncoder = Encoding.getEncoder(configObject.format);
        data = encoder.decode(decrypted);
        Logger.log.trace(
          `ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' decrypted and decoded.`,
          { data: data});
      } else {
        // if not encrypted, pass straight through.
        Logger.log.trace(
          `ClocoClient.decryptAndDecode: object '${wrapper.objectIdentifier}' not encrypted, passing through.`,
          { data: wrapper.configurationData});
        data = wrapper.configurationData;
      }

      return data;
    }
}
