/**
 *   encoding.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Static encoder factory.
 */
import { IEncoder } from "./iencoder";
export declare class Encoding {
    /**
     * Returns the correct encoder depending on the config object format.
     * @param  {string}   format The format string.
     * @return {IEncoder}        The encoder.
     */
    static getEncoder(format: string): IEncoder;
}
