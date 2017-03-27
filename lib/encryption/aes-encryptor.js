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
/**
 * Class to hold the intermediate data settings.
 */
class EncryptionParameters {
}
exports.EncryptionParameters = EncryptionParameters;
/**
 * Class containing logic for encrypting and decrypting data using AES256.
 */
class AesEncryptor {
    /**
     * Initializes a new instance of the AesEncryptor class.
     * @param  {string} passphrase    The encryption passphrase.
     * @return {void}                 Void.
     */
    constructor(passphrase) {
        this.passphrase = passphrase;
    }
    /**
     * Encrypts the object by JSON serializing it and then calling AES.
     */
    encrypt(data) {
        logger_1.Logger.log.debug("AesEncryptor.encrypt: start.");
        if (!this.passphrase) {
            throw new encryption_error_1.EncryptionError("Encryptionpassphrase not available.", "AES256");
        }
        let params = this.createKeyAndIV();
        let cipher = Crypto.createCipheriv("aes256", params.key, params.iv);
        let encrypted = cipher.update(data, "utf8", "base64");
        encrypted += cipher.final("base64");
        params.data = Buffer.concat([new Buffer("Salted__", "utf8"), params.salt, new Buffer(encrypted, "base64")]);
        logger_1.Logger.log.debug(`AesEncryptor.encrypt: encryption complete: '${encrypted}'.`);
        return params.data.toString("base64");
    }
    /**
     * Decrypts the object using AES256.
     */
    decrypt(encrypted) {
        logger_1.Logger.log.debug("AesEncryptor.decrypt: start.");
        if (!this.passphrase) {
            throw new encryption_error_1.EncryptionError("Encryptionpassphrase not available.", "AES256");
        }
        try {
            logger_1.Logger.log.debug(`AesEncryptor.decrypt: encrypted data: ${encrypted}`);
            let params = this.deriveKeyAndIV(encrypted);
            let decipher = Crypto.createDecipheriv("aes256", params.key, params.iv);
            let decrypted = decipher.update(params.content, "base64", "utf8");
            decrypted += decipher.final("utf8");
            logger_1.Logger.log.debug(`AesEncryptor.decrypt: decrypted data: ${decrypted}`);
            return decrypted;
        }
        catch (e) {
            logger_1.Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
            throw new encryption_error_1.EncryptionError(`Failed to decrypt: ${e}`, "AES256");
        }
    }
    /**
     * Derives the key, iv and content from a salted AES packet.
     * @param  {string}               data   The data.
     * @param  {string}               format The format of the data.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    deriveKeyAndIV(data, format) {
        logger_1.Logger.log.debug("AesIVDecryptor.deriveKeyAndIV: Start");
        // default to base64.
        format = format || "base64";
        let params = new EncryptionParameters();
        // convert the data into bytes.
        params.data = new Buffer(data, format);
        logger_1.Logger.log.debug(`AesIVDecryptor.deriveKeyAndIV: Data (base64): ${params.data.toString("base64")}`);
        // the salt is bytes 8-15.
        params.salt = params.data.slice(8, 16);
        logger_1.Logger.log.debug(`AesIVDecryptor.deriveKeyAndIV: Salt (hex): ${params.salt.toString("hex")}`);
        // the content is bytes 16 onwards
        params.content = params.data.slice(16);
        this.createHash(params);
        return params;
    }
    /**
     * Creates the key and IV using the passphrase and a random salt.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    createKeyAndIV() {
        logger_1.Logger.log.debug("AesIVDecryptor.createKeyAndIV: Start");
        let params = new EncryptionParameters();
        // the salt is bytes 8-15.
        params.salt = Crypto.randomBytes(8);
        logger_1.Logger.log.debug(`AesIVDecryptor.createKeyAndIV: Salt (hex): ${params.salt.toString("hex")}`);
        this.createHash(params);
        return params;
    }
    /**
     * Creates the hash, given the salt and passphrase.
     * @param {EncryptionParameters} params The encryption parameters.
     */
    createHash(params) {
        // the key and the IV are derived through 3 rounds of MD5 hashing, each generating 8 bytes of data.
        let rounds = 3;
        let data00 = Buffer.concat([new Buffer(this.passphrase, "utf8"), params.salt]);
        let md5hash = [new Buffer(Crypto.createHash("md5").update(data00).digest("base64"), "base64")];
        for (let i = 1; i < rounds; i++) {
            let data01 = Buffer.concat([md5hash[i - 1], data00]);
            md5hash[i] = new Buffer(Crypto.createHash("md5").update(data01).digest("base64"), "base64");
        }
        params.key = Buffer.concat([md5hash[0], md5hash[1]]);
        params.iv = md5hash[2];
        logger_1.Logger.log.debug(`AesIVDecryptor.createHash: Key (hex): ${params.key.toString("hex")}`);
        logger_1.Logger.log.debug(`AesIVDecryptor.createHash: IV (hex): ${params.iv.toString("hex")}`);
    }
}
exports.AesEncryptor = AesEncryptor;
