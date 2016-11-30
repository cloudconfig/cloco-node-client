/**
 *   passthrough-encryptor.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   Passthrough encryption (serializes but does not encrypt).
 */
import { EncryptionError } from "./encryption-error";
import { IEncryptor } from "./iencryptor";
import { Logger } from "../logging/logger";

export class PassthroughEncryptor implements IEncryptor {

/**
 * JSON serializing the input.
 */
 public encrypt(data: string): string {

      Logger.log.trace("PassthroughEncryptor.encrypt: start.");
      Logger.log.trace(`PassthroughEncryptor.encrypt: Received object of type '${typeof data}'`);

      return data;
 }

 /**
  * Parses the input as JSON.
  */
 public decrypt(encrypted: string): string {

    Logger.log.trace("PassthroughEncryptor.decrypt: start.");
    Logger.log.trace(`PassthroughEncryptor.decrypt: Received object of type '${typeof encrypted}'`);

    try {
      // string data coming from cloco is base64 encoded.
      if (typeof encrypted === "string") {
        return new Buffer(encrypted, "base64").toString();
      } else {
        return encrypted;
      }
    } catch (e) {
      Logger.log.error(`PassthroughEncryptor.decrypt: Failed to decrypt: ${e}`);
      throw new EncryptionError(`Failed to decrypt: ${e}`, "Passthrough");
    }
  }
}
