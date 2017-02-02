/// <reference types="node" />
import { CacheItem } from "./cache/cache-item";
import { ClocoApp } from "./types/clocoapp";
import { IOptions } from "./types/ioptions";
import { EventDispatcher } from "./events/event-dispatcher";
/**
 * Class ClocoClient
 *
 * A class that connects to cloco to retrieve configuration.
 */
export declare class ClocoClient {
    options: IOptions;
    app: ClocoApp;
    onConfigurationLoaded: EventDispatcher<ClocoClient, CacheItem>;
    onCacheExpired: EventDispatcher<ClocoClient, CacheItem>;
    onError: EventDispatcher<ClocoClient, Error>;
    private timer;
    constructor(options: IOptions);
    /**
     * Initializes the client.  Loads the application and configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    init(): Promise<void>;
    /**
     * Gets the item from the cache.
     */
    get<T>(objectId: string): T;
    /**
     * Puts an item into cloco.
     * @type {string}
     */
    put<T>(objectId: string, item: T): Promise<void>;
    /**
     * Checks for cache timeouts.  Can be run from the timer or invoked by the parent application.
     */
    checkCacheTimeouts(): void;
    /**
     * Loads the cloco application.
     * @return {Promise<void>} A promise of the work completing.
     */
    private initializeApplication();
    /**
     * Load the configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    private initializeConfiguration();
    /**
     * Loads the single configuration object from the server.
     * @param  {string}        objectId     The object identifier.
     * @param  {boolean}       initializing Indicates that an error should be raised if an error is encountered.
     * @return {Promise<void>}              A promise of the work completing.
     */
    private loadConfigurationObjectWrapperFromApi(objectId, initializing?);
    /**
     * Checks to see if the environment exists.
     * @param {string} environmentId A value indicating that the environment exists.
     */
    private environmentExists(environmentId);
    /**
     * Retrieves the config object metadata from the application.
     * @param  {string}       objectId The object identifier.
     * @return {ConfigObject}          The congif object metadata.
     */
    private getConfigObjectMetadata(objectId);
    /**
     * Encodes and encrypts an item ready to send to the API.
     * @param  {string} objectId The object identifier.
     * @param  {any}    item     The item to send.
     * @return {any}             The encoded and encrypted item.
     */
    private encodeAndEncrypt(objectId, item);
    /**
     * Decrypts and decodes the config object wrapper.
     * @param  {ConfigObjectWrapper} wrapper The config object wrapper.
     * @return {any}                         The decoded data.
     */
    private decryptAndDecode(wrapper);
}
