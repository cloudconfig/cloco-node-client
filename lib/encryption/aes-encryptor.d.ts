import { IEncryptor } from "./iencryptor";
export declare class AesEncryptor implements IEncryptor {
    /**
     * The encryption key.
     * @type {string}
     */
    key: string;
    /**
     * Initializes a new instance of the AesEncryptor class.
     * @param  {string} encryptionKey The encryption key.
     * @return {void}                 Void.
     */
    constructor(encryptionKey: string);
    /**
     * Encrypts the object by JSON serializing it and then calling AES.
     */
    encrypt(data: string): string;
    /**
     * Decrypts the object and then parses it as JSON.
     */
    decrypt(encrypted: string): string;
}
