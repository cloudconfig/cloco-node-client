"use strict";
/**
 *   aes-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Implements encryption using the AES algorithm.
 */
const CryptoJS = require("crypto-js");
const logger_1 = require("../logging/logger");
const encryption_error_1 = require("./encryption-error");
class AesEncryptor {
    /**
     * Initializes a new instance of the AesEncryptor class.
     * @param  {string} encryptionKey The encryption key.
     * @return {void}                 Void.
     */
    constructor(encryptionKey) {
        this.key = encryptionKey;
    }
    /**
     * Encrypts the object by JSON serializing it and then calling AES.
     */
    encrypt(data) {
        logger_1.Logger.log.trace("AesEncryptor.encrypt: start.");
        if (!this.key) {
            throw new encryption_error_1.EncryptionError("Encryptionkey not available.", "AES");
        }
        return CryptoJS.AES.encrypt(data, this.key).toString();
    }
    /**
     * Decrypts the object and then parses it as JSON.
     */
    decrypt(encrypted) {
        logger_1.Logger.log.trace("AesEncryptor.decrypt: start.");
        if (!this.key) {
            throw new encryption_error_1.EncryptionError("Encryptionkey not available.", "AES");
        }
        try {
            return CryptoJS.AES.decrypt(encrypted, this.key).toString(CryptoJS.enc.Utf8);
        }
        catch (e) {
            logger_1.Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
            throw new encryption_error_1.EncryptionError(`Failed to decrypt: ${e}`, "AES");
        }
    }
}
exports.AesEncryptor = AesEncryptor;
