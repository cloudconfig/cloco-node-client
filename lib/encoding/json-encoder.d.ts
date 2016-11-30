import { IEncoder } from "./iencoder";
export declare class JsonEncoder implements IEncoder {
    /**
     * Encodes the object as JSON.
     */
    encode(obj: any): string;
    /**
     * Decodes the string.  Parses as JSON.
     * @type {any}
     */
    decode(encoded: string): any;
}
