"use strict";
/**
 *   aes-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Implements encryption using the AES algorithm.
 */
const Crypto = require("crypto");
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
        logger_1.Logger.log.debug("AesEncryptor.encrypt: start.");
        if (!this.key) {
            throw new encryption_error_1.EncryptionError("Encryptionkey not available.", "AES");
        }
        let cipher = Crypto.createCipher("aes256", this.key);
        let encrypted = cipher.update(data, "utf8", "base64");
        encrypted += cipher.final("base64");
        logger_1.Logger.log.debug(`AesEncryptor.encrypt: encryption complete: '${encrypted}'.`);
        return encrypted;
    }
    /**
     * Decrypts the object and then parses it as JSON.
     */
    decrypt(encrypted) {
        logger_1.Logger.log.debug("AesEncryptor.decrypt: start.");
        if (!this.key) {
            throw new encryption_error_1.EncryptionError("Encryptionkey not available.", "AES");
        }
        try {
            logger_1.Logger.log.debug(`AesEncryptor.decrypt: encrypted data: ${encrypted}`);
            let decipher = Crypto.createDecipher("aes256", this.key);
            let decrypted = decipher.update(encrypted, "base64", "utf8");
            decrypted += decipher.final("utf8");
            logger_1.Logger.log.debug(`AesEncryptor.decrypt: decrypted data: ${decrypted}`);
            return decrypted;
        }
        catch (e) {
            logger_1.Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
            throw new encryption_error_1.EncryptionError(`Failed to decrypt: ${e}`, "AES");
        }
    }
}
exports.AesEncryptor = AesEncryptor;
