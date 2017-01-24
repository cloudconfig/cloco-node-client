"use strict";
/**
 *   logger.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static accessor to the logger.
 */
const bunyan = require("bunyan");
/**
 * Class to provide static accessors over the restify client promises.
 */
class Logger {
    /**
     * Initializes the static logger.
     * @param {IOptions} options The initialization options.
     */
    static init(options) {
        if (options.log) {
            Logger.log = options.log;
        }
        else {
            Logger.log = bunyan.createLogger({
                name: "cloco-node-client",
            });
        }
        Logger.log.debug("Logging is initialized.");
    }
}
exports.Logger = Logger;
