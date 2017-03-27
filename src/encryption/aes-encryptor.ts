/**
 *   aes-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Implements encryption using the AES algorithm.
 */
import * as Crypto from "crypto";
import { Logger } from "../logging/logger";
import { EncryptionError } from "./encryption-error";
import { IEncryptor } from "./iencryptor";

/**
 * Class to hold the intermediate data settings.
 */
export class EncryptionParameters {
    public content: Buffer;
    public data: Buffer;
    public iv: Buffer;
    public key: Buffer;
    public salt: Buffer;
}

/**
 * Class containing logic for encrypting and decrypting data using AES256.
 */
export class AesEncryptor implements IEncryptor {

    /**
     * The encryption passphrase.
     * @type {string}
     */
    public passphrase: string;

    /**
     * Initializes a new instance of the AesEncryptor class.
     * @param  {string} passphrase    The encryption passphrase.
     * @return {void}                 Void.
     */
    constructor(passphrase: string) {
        this.passphrase = passphrase;
    }

    /**
     * Encrypts the object by JSON serializing it and then calling AES.
     */
    public encrypt(data: string): string {

        Logger.log.debug("AesEncryptor.encrypt: start.");

        if (!this.passphrase) {
            throw new EncryptionError("Encryptionpassphrase not available.", "AES256");
        }

        let params: EncryptionParameters = this.createKeyAndIV();

        let cipher: Crypto.Cipher = Crypto.createCipheriv("aes256", params.key, params.iv);
        let encrypted: string = cipher.update(data, "utf8", "base64");
        encrypted += cipher.final("base64");

        params.data = Buffer.concat([new Buffer("Salted__", "utf8"), params.salt, new Buffer(encrypted, "base64")]);

        Logger.log.debug(`AesEncryptor.encrypt: encryption complete: '${encrypted}'.`);

        return params.data.toString("base64");
    }

    /**
     * Decrypts the object using AES256.
     */
    public decrypt(encrypted: string): string {

        Logger.log.debug("AesEncryptor.decrypt: start.");

        if (!this.passphrase) {
            throw new EncryptionError("Encryptionpassphrase not available.", "AES256");
        }

        try {
            Logger.log.debug(`AesEncryptor.decrypt: encrypted data: ${encrypted}`);

            let params: EncryptionParameters = this.deriveKeyAndIV(encrypted);

            let decipher: Crypto.Decipher = Crypto.createDecipheriv("aes256", params.key, params.iv);
            let decrypted: string = decipher.update(params.content, "base64", "utf8");
            decrypted += decipher.final("utf8");

            Logger.log.debug(`AesEncryptor.decrypt: decrypted data: ${decrypted}`);

            return decrypted;
        } catch (e) {
            Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
            throw new EncryptionError(`Failed to decrypt: ${e}`, "AES256");
        }
    }

    /**
     * Derives the key, iv and content from a salted AES packet.
     * @param  {string}               data   The data.
     * @param  {string}               format The format of the data.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    public deriveKeyAndIV(data: string, format?: string): EncryptionParameters {

        Logger.log.debug("AesIVDecryptor.deriveKeyAndIV: Start");

        // default to base64.
        format = format || "base64";
        let params: EncryptionParameters = new EncryptionParameters();

        // convert the data into bytes.
        params.data = new Buffer(data, format);
        Logger.log.debug(`AesIVDecryptor.deriveKeyAndIV: Data (base64): ${params.data.toString("base64")}`);

        // the salt is bytes 8-15.
        params.salt = params.data.slice(8, 16);
        Logger.log.debug(`AesIVDecryptor.deriveKeyAndIV: Salt (hex): ${params.salt.toString("hex")}`);

        // the content is bytes 16 onwards
        params.content = params.data.slice(16);

        this.createHash(params);

        return params;
    }

    /**
     * Creates the key and IV using the passphrase and a random salt.
     * @return {EncryptionParameters}        The encryption parameters.
     */
    public createKeyAndIV(): EncryptionParameters {

        Logger.log.debug("AesIVDecryptor.createKeyAndIV: Start");

        let params: EncryptionParameters = new EncryptionParameters();

        // the salt is bytes 8-15.
        params.salt = Crypto.randomBytes(8);
        Logger.log.debug(`AesIVDecryptor.createKeyAndIV: Salt (hex): ${params.salt.toString("hex")}`);

        this.createHash(params);

        return params;
    }

    /**
     * Creates the hash, given the salt and passphrase.
     * @param {EncryptionParameters} params The encryption parameters.
     */
    private createHash(params: EncryptionParameters): void {

        // the key and the IV are derived through 3 rounds of MD5 hashing, each generating 8 bytes of data.
        let rounds: number = 3;
        let data00: Buffer = Buffer.concat([new Buffer(this.passphrase, "utf8"), params.salt]);
        let md5hash: Buffer[] = [new Buffer(Crypto.createHash("md5").update(data00).digest("base64"), "base64")];

        for (let i: number = 1; i < rounds; i++) {
            let data01: Buffer = Buffer.concat([md5hash[i - 1], data00]);
            md5hash[i] = new Buffer(Crypto.createHash("md5").update(data01).digest("base64"), "base64");
        }

        params.key = Buffer.concat([md5hash[0], md5hash[1]]);
        params.iv = md5hash[2];

        Logger.log.debug(`AesIVDecryptor.createHash: Key (hex): ${params.key.toString("hex")}`);
        Logger.log.debug(`AesIVDecryptor.createHash: IV (hex): ${params.iv.toString("hex")}`);

    }
}
