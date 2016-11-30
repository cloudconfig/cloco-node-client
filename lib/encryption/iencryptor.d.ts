/**
 *   iencryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Interface to describe an encryption component.
 */
export interface IEncryptor {
    /**
     * Encrypts the given data into a string.
     * @type {string}
     */
    encrypt(data: string): string;
    /**
     * Decrypts the given string.
     * @param  {string} encrypted The encrypted data.
     * @return {string}           The decrypted data.
     */
    decrypt(encrypted: string): string;
}
