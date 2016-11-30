import { IEncoder } from "./iencoder";
export declare class StringEncoder implements IEncoder {
    /**
     * Encodes the object assuming it can be cast to a string.
     */
    encode(obj: any): string;
    /**
     * Decodes the string.  Passthrough.
     * @type {any}
     */
    decode(encoded: string): any;
}
