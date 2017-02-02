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
 *   file-system.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
const fs = require("fs");
const logger_1 = require("./logging/logger");
/**
 * Class FileSystem
 *
 * Wraps the node file system operations as promises.
 */
class FileSystem {
    /**
     * Wraps the fs.readFile operation as a promise.
     * @param  {string}          filename The file name.
     * @return {Promise<string>}          The file contents.
     */
    static readFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`FileSystem.readFile: reading '${filename}' from disk.`);
            return new Promise(function (resolve, reject) {
                fs.readFile(filename, "utf8", function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        logger_1.Logger.log.debug(`FileSystem.readFile: resolving promise.`);
                        resolve(data);
                    }
                });
            });
        });
    }
    /**
     * Wraps the fs.writeFile operation as a promise.
     * @param  {string}        filename The filename.
     * @param  {string}        data     The string data to write to file.
     * @return {Promise<void>}          A promise of the work completing.
     */
    static writeFile(filename, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.Logger.log.debug(`FileSystem.writeFile: writing '${filename}' to disk.`);
            return new Promise(function (resolve, reject) {
                fs.writeFile(filename, data, "utf8", function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        logger_1.Logger.log.debug(`FileSystem.writeFile: resolving promise.`);
                        resolve();
                    }
                });
            });
        });
    }
    /**
     * Returns the user home path.
     * @return {string} The user home path.
     */
    static getUserHome() {
        logger_1.Logger.log.debug(`FileSystem.getUserHome: start.`);
        if (FileSystem.getPlatform() === "win32") {
            logger_1.Logger.log.debug(`FileSystem.getUserHome: returning win32 home directory.`);
            return process.env.USERPROFILE;
        }
        else {
            logger_1.Logger.log.debug(`FileSystem.getUserHome: returning default home directory.`);
            return process.env.HOME;
        }
    }
    /**
     * Returns the platform.
     * @return {string} The platform.
     */
    static getPlatform() {
        return process.platform;
    }
}
exports.FileSystem = FileSystem;
