/**
 * Class FileSystem
 *
 * Wraps the node file system operations as promises.
 */
export declare class FileSystem {
    /**
     * Wraps the fs.readFile operation as a promise.
     * @param  {string}          filename The file name.
     * @return {Promise<string>}          The file contents.
     */
    static readFile(filename: string): Promise<string>;
    /**
     * Wraps the fs.writeFile operation as a promise.
     * @param  {string}        filename The filename.
     * @param  {string}        data     The string data to write to file.
     * @return {Promise<void>}          A promise of the work completing.
     */
    static writeFile(filename: string, data: string): Promise<void>;
}
