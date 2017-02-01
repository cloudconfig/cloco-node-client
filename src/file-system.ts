/**
 *   file-system.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import * as fs from "fs";
import { Logger } from "./logging/logger";

/**
 * Class FileSystem
 *
 * Wraps the node file system operations as promises.
 */
export class FileSystem {

    /**
     * Wraps the fs.readFile operation as a promise.
     * @param  {string}          filename The file name.
     * @return {Promise<string>}          The file contents.
     */
    public static async readFile(filename: string): Promise<string> {

        Logger.log.debug(`FileSystem.readFile: reading '${filename}' from disk.`);

        return new Promise<string>(

            function(
                resolve: (value?: string | PromiseLike<string>) => void,
                reject: (reason?: any) => void): void {

                fs.readFile(filename, "utf8", function(err: Error, data: string): void {
                    if (err) {
                        reject(err);
                    } else {
                        Logger.log.debug(`FileSystem.readFile: resolving promise.`);
                        resolve(data);
                    }
                });
            });
    }

    /**
     * Wraps the fs.writeFile operation as a promise.
     * @param  {string}        filename The filename.
     * @param  {string}        data     The string data to write to file.
     * @return {Promise<void>}          A promise of the work completing.
     */
    public static async writeFile(filename: string, data: string): Promise<void> {

        Logger.log.debug(`FileSystem.writeFile: writing '${filename}' to disk.`);

        return new Promise<void>(

            function(
                resolve: (value?: PromiseLike<void>) => void,
                reject: (reason?: any) => void): void {

                fs.writeFile(filename, data, "utf8", function(err: Error): void {
                    if (err) {
                        reject(err);
                    } else {
                        Logger.log.debug(`FileSystem.writeFile: resolving promise.`);
                        resolve();
                    }
                });
            });
    }
}
