/**
 *   json-encoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Encoding to cast objects to JSON.
 */
import { Logger } from "../logging/logger";
import { IEncoder } from "./iencoder";

export class JsonEncoder implements IEncoder {
  /**
   * Encodes the object as JSON.
   */
  public encode(obj: any): string {
    Logger.log.debug("JsonEncoder.encode: start.");
    return JSON.stringify(obj);
  }

  /**
   * Decodes the string.  Parses as JSON.
   * @type {any}
   */
  public decode(encoded: string): any {
    Logger.log.debug("JsonEncoder.decode: start.");
    return JSON.parse(encoded);
  }
}
