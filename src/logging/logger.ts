/**
 *   logger.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static accessor to the logger.
 */
import * as bunyan from "bunyan";
import { IOptions } from "../types/ioptions";

/**
 * Class to provide static accessors over the restify client promises.
 */
export class Logger {
  /**
   * The logger.
   * @type {bunyan.Logger}
   */
  public static log: bunyan.Logger;

  /**
   * Initializes the static logger.
   * @param {IOptions} options The initialization options.
   */
  public static init(options: IOptions): void {
    if (options.log) {
      Logger.log = options.log;
    } else {
      Logger.log = bunyan.createLogger({
            name: "cloco-node-client",
        });
    }

    Logger.log.debug("Logging is initialized.");
  }
}
