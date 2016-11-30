/**
 *   index.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   entry point into the cloco client.
 */
import { ClocoClient } from "./cloco-client";
import { IOptions } from "./types/ioptions";
import { AesEncryptor } from "./encryption/aes-encryptor";

function createClient(options: IOptions): ClocoClient {
  return new ClocoClient(options);
}

function createAesEncryptor(encryptionKey: string): AesEncryptor {
  return new AesEncryptor(encryptionKey);
}

export { ClocoClient } from "./cloco-client";
export { createClient };
export { createAesEncryptor };
