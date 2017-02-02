import { IOptions } from "./types/ioptions";
export declare class Settings {
    /**
     * Loads the default settings from file.
     */
    static setDefaults(options: IOptions): void;
    /**
     * Reads the bearer token from the local config store.
     * @return {string} The bearer token.
     */
    static getBearerToken(): string;
    /**
     * Stores the bearer token in the local config store.
     * @param {string} token The bearer token.
     */
    static storeBearerToken(token: string): Promise<void>;
    /**
     * Gets the refresh token from the local config store.
     * @return {string} The refresh token.
     */
    static getRefreshToken(): string;
    /**
     * Gets the default subscription from the local config store.
     * @return {string} The subscription id.
     */
    static getDefaultSubscription(): string;
    /**
     * Gets the default application from the local config store.
     * @return {string} The application id.
     */
    static getDefaultApplication(): string;
    /**
     * Gets the default environment from the local config store.
     * @return {string} The environment id.
     */
    static getDefaultEnvironment(): string;
    /**
     * Gets the default cloco API url from the local store (for on-prem installations).
     * @return {string} The default cloco API url.
     */
    static getDefaultUrl(): string;
    /**
     * Reads the content from a file.
     * @param  {string} path The path of the file.
     * @return {string}      The contents of the file.
     */
    private static readFileContent(path);
    /**
     * Ensures that the local config directories exist.
     */
    private static ensureLocalDirs();
}
