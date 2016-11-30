/**
 *    cache-item.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
"use strict";
/**
 *   class CacheItem
 *   Represents a cached configuration object.
 */
class CacheItem {
    /**
     * Returns a value indicating whether the cache item has expired.
     * @return {boolean} A value indicating expiry.
     */
    isExpired() {
        return this.expires && this.expires < new Date();
    }
}
exports.CacheItem = CacheItem;
