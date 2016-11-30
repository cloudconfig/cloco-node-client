/**
 *   ioptions.ts
 *   Copyright (c) 345 Systems LLP 2016, all rights reserved.
 *
 *   cloco initialization options.
 */
import * as bunyan from "bunyan";
import { IEncryptor } from "../encryption/iencryptor";
import { Credentials } from "./credentials";
import { Tokens } from "./tokens";

export interface IOptions {

  /**
   * The cloco applicatio9n identifier.
   * @type {string}
   */
  application?: string;

  /**
   * The interval in milliseconds between checking the cache for expired items.
   * @type {number}
   */
  cacheCheckInterval?: number;

  /**
   * The client credentials expressed as a key/secret pair.
   * @type {Credentials}
   */
  credentials?: Credentials;

  /**
   * The tokens with which to access the API.
   * @type {Tokens}
   */
  tokens?: Tokens;

  /**
   * Encryption component.
   * @type {IEncryptor}
   */
  encryptor?: IEncryptor;

  /**
   * The selected environment.
   * @type {string}
   */
  environment?: string;

/**
 * A bunyan logger;
 * @type {bunyan.Logger}
 */
  log?: bunyan.Logger;

  /**
   * The cloco subscription identifier.
   * @type {string}
   */
  subscription?: string;

  /**
   * The time-to-live of the cached configuration.
   * @type {number}
   */
  ttl?: number;

  /**
   * The cloco api url (if not default).
   * @type {string}
   */
  url?: string;

}
