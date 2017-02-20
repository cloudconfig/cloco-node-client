import { IOptions } from "./types/ioptions";
export declare class Settings {
    /**
     * Loads the default settings from file.
     */
    static setDefaults(options: IOptions): void;
    /**
     * Returns the path to the local ini file created by cloco-cli
     * @return {string} [description]
     */
    private static getConfigFilePath();
}
