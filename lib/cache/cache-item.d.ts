/**
 *    cache-item.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
/**
 *   class CacheItem
 *   Represents a cached configuration object.
 */
export declare class CacheItem {
    /**
     * The key for the item.
     * @type {string}
     */
    key: string;
    /**
     * The value of the item.
     * @type {any}
     */
    value: any;
    /**
     * The time to live in the cache.
     * @type {number}
     */
    ttl: number;
    /**
     * The date the cache item expires.
     * @type {Date}
     */
    expires: Date;
    /**
     * A revision number to mark whether the cache item needs updating.
     * @type {number}
     */
    revision: number;
    /**
     * Returns a value indicating whether the cache item has expired.
     * @return {boolean} A value indicating expiry.
     */
    isExpired(): boolean;
}
