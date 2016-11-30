/**
 *   encoding.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static encoder factory.
 */
import { IEncoder } from "./iencoder";
import { JsonEncoder } from "./json-encoder";
import { StringEncoder } from "./string-encoder";

export class Encoding {

  /**
   * Returns the correct encoder depending on the config object format.
   * @param  {string}   format The format string.
   * @return {IEncoder}        The encoder.
   */
  public static getEncoder(format: string): IEncoder {
    switch (format) {
      case "JSON":
        return new JsonEncoder();
      default:
        return new StringEncoder();
    }
  }
}
