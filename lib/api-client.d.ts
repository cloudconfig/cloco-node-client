import { IOptions } from "./types/ioptions";
import { ClocoApp, ConfigObjectWrapper } from "./types/clocoapp";
/**
 * Class to provide static accessors over the restify client promises.
 */
export declare class ApiClient {
    /**
     * Retrieves the application from the api.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<ClocoApp>}         A promise of the application.
     */
    static getApplication(options: IOptions): Promise<ClocoApp>;
    /**
     * Retrieves the application from the api.
     * @param  {IOptions}           options           The initialization options.
     * @param  {string}             objectId          The config object id.
     * @return {Promise<ConfigObjectWrapper>}         A promise of the config object.
     */
    static getConfigObject(options: IOptions, objectId: string): Promise<ConfigObjectWrapper>;
    /**
     * Writes the config object to the server.
     * @param  {IOptions}      options  The options.
     * @param  {string}        objectId The object Id.
     * @param  {any}           body     The item to write.
     * @return {Promise<ConfigObjectWrapper>}          A promise of the work completing.
     */
    static putConfigObject(options: IOptions, objectId: string, body: any): Promise<ConfigObjectWrapper>;
    /**
     * Checks the bearer token for expiry and, if expired, refreshes.
     * @return {Promise<void>} A promise of the work completing.
     */
    private static checkBearerToken(options);
    /**
     * Refreshes the bearer token.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<AccessTokenResponse>}         A promise of the access token.
     */
    private static getAccessTokenFromRefreshToken(options);
    /**
     * Refreshes the bearer token.
     * @param  {IOptions}          options The initialization options.
     * @return {Promise<AccessTokenResponse>}         A promise of the access token.
     */
    private static getAccessTokenFromClientCredentials(options);
    /**
     * Gets the restify options based on the settings.
     * @param  {IOptions}              options The options.
     * @return {restify.ClientOptions}         The restify client options.
     */
    private static getRestifyOptions(options, credentialType?);
}
