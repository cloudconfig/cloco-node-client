/**
 *    cache-item.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */

/**
 *   class CacheItem
 *   Represents a cached configuration object.
 */
export class CacheItem {

  /**
   * The key for the item.
   * @type {string}
   */
  public key: string;

  /**
   * The value of the item.
   * @type {any}
   */
  public value: any;

  /**
   * The time to live in the cache.
   * @type {number}
   */
  public ttl: number;

  /**
   * The date the cache item expires.
   * @type {Date}
   */
  public expires: Date;

  /**
   * A revision number to mark whether the cache item needs updating.
   * @type {number}
   */
  public revision: number;

  /**
   * Returns a value indicating whether the cache item has expired.
   * @return {boolean} A value indicating expiry.
   */
  public isExpired(): boolean {
    return this.expires && this.expires < new Date();
  }
}
