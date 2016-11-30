/**
 *   aes-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Implements encryption using the AES algorithm.
 */
import * as CryptoJS from "crypto-js";
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

     Logger.log.trace("AesEncryptor.encrypt: start.");

     if (!this.key) {
       throw new EncryptionError("Encryptionkey not available.", "AES");
     }
     return CryptoJS.AES.encrypt(data, this.key).toString();
 }

 /**
  * Decrypts the object and then parses it as JSON.
  */
 public decrypt(encrypted: string): string {

     Logger.log.trace("AesEncryptor.decrypt: start.");

     if (!this.key) {
       throw new EncryptionError("Encryptionkey not available.", "AES");
     }

     try {
       return CryptoJS.AES.decrypt(encrypted, this.key).toString(CryptoJS.enc.Utf8);
     } catch (e) {
       Logger.log.error(`AesEncryptor.decrypt: Failed to decrypt: ${e}`);
       throw new EncryptionError(`Failed to decrypt: ${e}`, "AES");
     }
  }
}
