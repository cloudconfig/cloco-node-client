"use strict";
/**
 *   passthrough-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Passthrough encryption (serializes but does not encrypt).
 */
const encryption_error_1 = require("./encryption-error");
const logger_1 = require("../logging/logger");
class PassthroughEncryptor {
    /**
     * JSON serializing the input.
     */
    encrypt(data) {
        logger_1.Logger.log.trace("PassthroughEncryptor.encrypt: start.");
        logger_1.Logger.log.trace(`PassthroughEncryptor.encrypt: Received object of type '${typeof data}'`);
        return data;
    }
    /**
     * Parses the input as JSON.
     */
    decrypt(encrypted) {
        logger_1.Logger.log.trace("PassthroughEncryptor.decrypt: start.");
        logger_1.Logger.log.trace(`PassthroughEncryptor.decrypt: Received object of type '${typeof encrypted}'`);
        try {
            // string data coming from cloco is base64 encoded.
            if (typeof encrypted === "string") {
                return new Buffer(encrypted, "base64").toString();
            }
            else {
                return encrypted;
            }
        }
        catch (e) {
            logger_1.Logger.log.error(`PassthroughEncryptor.decrypt: Failed to decrypt: ${e}`);
            throw new encryption_error_1.EncryptionError(`Failed to decrypt: ${e}`, "Passthrough");
        }
    }
}
exports.PassthroughEncryptor = PassthroughEncryptor;
