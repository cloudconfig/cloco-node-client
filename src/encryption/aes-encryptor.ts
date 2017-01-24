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

export class AesEncryptor implements IEncryptor {

  /**
   * The encryption key.
   * @type {string}
   */
  public key: string;

  /**
   * Initializes a new instance of the AesEncryptor class.
   * @param  {string} encryptionKey The encryption key.
   * @return {void}                 Void.
   */
  constructor(encryptionKey: string) {
    this.key = encryptionKey;
  }

/**
 * Encrypts the object by JSON serializing it and then calling AES.
 */
 public encrypt(data: string): string {

     Logger.log.debug("AesEncryptor.encrypt: start.");

     if (!this.key) {
       throw new EncryptionError("Encryptionkey not available.", "AES");
     }

     let cipher: Crypto.Cipher = Crypto.createCipher("aes256", this.key);
     let encrypted: string = cipher.update(data, "utf8", "base64");
     encrypted += cipher.final("base64");

     Logger.log.debug(`AesEncryptor.encrypt: encryption complete: '${encrypted}'.`);

     return encrypted;
 }

 /**
  * Decrypts the object and then parses it as JSON.
  */
 public decrypt(encrypted: string): string {

     Logger.log.debug("AesEncryptor.decrypt: start.");

     if (!this.key) {
       throw new EncryptionError("Encryptionkey not available.", "AES");
     }

     try {
       Logger.log.debug(`AesEncryptor.decrypt: encrypted data: ${encrypted}`);

       let decipher: Crypto.Decipher = Crypto.createDecipher("aes256", this.key);
       let decrypted: string = decipher.update(encrypted, "base64", "utf8");
       decrypted += decipher.final("utf8");

       Logger.log.debug(`AesEncryptor.decrypt: decrypted data: ${decrypted}`);

       return decrypted;
     } catch (e) {
       Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
       throw new EncryptionError(`Failed to decrypt: ${e}`, "AES");
     }
  }
}
