/**
 *   iencoder.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Interface to describe an encoder.
 */

export interface IEncoder {

  /**
   * Encodes the given object into a string.
   * @type {any}
   */
  encode(obj: any): string;

  /**
   * Decodes the data into an object.
   * @type {any}
   */
  decode(encoded: string): any;

}
