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
    onError: EventDispatcher<ClocoClient, string>;
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
     * Loads the cloco application.
     * @return {Promise<void>} A promise of the work completing.
     */
    private loadApplication();
    /**
     * Load the configuration.
     * @return {Promise<void>} A promise of the work completing.
     */
    private loadConfigurationFromApi();
    /**
     * Loads the single configuration object from the server.
     * @param  {string}        objectId The object identifier.
     * @return {Promise<void>}          A promise of the work completing.
     */
    private loadConfigurationObjectWrapperFromApi(objectId);
    /**
     * Checks for cache timeouts.
     */
    private checkCacheTimeouts();
    /**
     * Checks the bearer token for expiry and, if expired, refreshes.
     * @return {Promise<void>} A promise of the work completing.
     */
    private checkBearerToken();
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
    private getConfigObject(objectId);
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
