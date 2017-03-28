/// <reference types="node" />
import { IEncryptor } from "./iencryptor";
/**
 * Class to hold the intermediate data settings.
 */
export declare class EncryptionParameters {
    content: Buffer;
    data: Buffer;
    iv: Buffer;
    key: Buffer;
    salt: Buffer;
}
/**
 * Class containing logic for encrypting and decrypting data using AES256.
 */
export declare class AesEncryptor implements IEncryptor {
    /**
     * The encryption passphrase.
     * @type {string}
     */
    passphrase: string;
    /**
     * Initializes a new instance of the AesEncryptor class.
     * @param  {string} passphrase    The encryption passphrase.
     * @return {void}                 Void.
     */
    constructor(passphrase: string);
    /**
     * Encrypts the object by JSON serializing it and then calling AES.
     */
    encrypt(data: string): string;
    /**
     * Decrypts the object using AES256.
     */
    decrypt(encrypted: string): string;
    /**
     * Derives the key, iv and content from a salted AES packet.
     * @param  {string}               data   The data.
     * @param  {string}               format The format of the data.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    deriveKeyAndIV(data: string, format?: string): EncryptionParameters;
    /**
     * Creates the key and IV using the passphrase and a random salt.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    createKeyAndIV(): EncryptionParameters;
    /**
     * Creates the hash, given the salt and passphrase.
     * @param {EncryptionParameters} params The encryption parameters.
     */
    private createHash(params);
}
