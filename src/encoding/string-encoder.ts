/**
 *   string-encoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Encoding for strings.
 */
import { Logger } from "../logging/logger";
import { IEncoder } from "./iencoder";

export class StringEncoder implements IEncoder {

  /**
   * Encodes the object assuming it can be cast to a string.
   */
  public encode(obj: any): string {
    Logger.log.debug("StringEncoder.encode: start.");
    return obj.toString();
  }

  /**
   * Decodes the string.  Passthrough.
   * @type {any}
   */
  public decode(encoded: string): any {
    Logger.log.debug("StringEncoder.decode: start.");
    return encoded;
  }
}
