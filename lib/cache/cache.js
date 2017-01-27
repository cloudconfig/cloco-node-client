"use strict";
/**
 *    cache.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
const logger_1 = require("../logging/logger");
const cache_item_1 = require("./cache-item");
/**
 *   class Cache
 *   Represents a cache for configuration objects.
 */
class Cache {
    constructor() {
        this.items = [];
    }
    /**
     * Static constructor for the cache singleton.
     */
    static init() {
        Cache.current = new Cache();
    }
    /**
     * Adds an item to the cache.
     * @param {CacheItem} item A cache item.
     */
    add(item) {
        logger_1.Logger.log.debug("Cache.add: start");
        // set the expiry.
        logger_1.Logger.log.debug(`Cache.add: Attempting to set the expiry from the TTL.  TTL: '${item.ttl}'`);
        if (item.ttl >= 0) {
            item.expires = new Date();
            item.expires.setTime(item.expires.getTime() + item.ttl * 1000);
            logger_1.Logger.log.debug(`Cache.add: Item expiry has been set: '${item.expires}'`);
        }
        if (!this.items) {
            logger_1.Logger.log.debug("Cache.add: Items array does not exist.  Creating...");
            this.items = [item];
            return;
        }
        else {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].key === item.key) {
                    logger_1.Logger.log.debug(`Cache.add: Item '${item.key}' located in items array.  Updating....`);
                    this.items[i] = item;
                    return;
                }
            }
            logger_1.Logger.log.debug("Cache.add: Item not located in items array.  Adding....");
            this.items.push(item);
            logger_1.Logger.log.debug(`Cache.add: Cache contains '${this.items.length}' items.`);
        }
    }
    /**
     * Adds an item by creating the cache item then adding to the cache.
     * @param {string} key   The key.
     * @param {any}    value The item to add.
     * @param {number} revision   The item's revision number.
     * @param {number} ttl   The TTL of the item in cache.
     */
    addItem(key, value, revision, ttl) {
        logger_1.Logger.log.debug(`Cache.addItem: start. key: '${key}', revision: '${revision}'`);
        let existing = this.get(key);
        if (!existing || existing.revision < revision) {
            logger_1.Logger.log.debug(`Cache.addItem: new revision '${revision}' detected, adding to cache.`);
            let cacheItem = new cache_item_1.CacheItem();
            cacheItem.key = key;
            cacheItem.value = value;
            cacheItem.revision = revision;
            cacheItem.ttl = ttl;
            this.add(cacheItem);
            return cacheItem;
        }
        else {
            this.add(existing);
            logger_1.Logger.log.debug(`Cache.addItem: no change from existing revision '${revision}', no cache update.`);
            return undefined;
        }
    }
    /**
     * Gets an item from the cache.
     * @param  {string} key The item key.
     * @return {CacheItem}  The cache item.
     */
    get(key) {
        logger_1.Logger.log.debug("Cache.get: start");
        if (this.exists(key)) {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].key === key) {
                    logger_1.Logger.log.debug(`Cache.get: Item '${key}' located in items array.  Returning....`);
                    if (this.items[i].isExpired()) {
                        logger_1.Logger.log.info(`Cache.get: Item '${key}' has expired.`);
                    }
                    return this.items[i];
                }
            }
            return undefined;
        }
        else {
            logger_1.Logger.log.debug("Cache.get: Item not located in items array.");
            return undefined;
        }
    }
    /**
     * Checks for the existence of the item in the cache.
     * @param  {string}  key The key of the item.
     * @return {boolean}     A value indicating whether the item exists in the cache.
     */
    exists(key) {
        logger_1.Logger.log.debug("Cache.exists: start");
        if (!this.items) {
            logger_1.Logger.log.warn("Cache.exists: Items array does not exist.");
            return false;
        }
        else {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].key === key) {
                    logger_1.Logger.log.debug(`Cache.exists: Item '${key}' located in items array.`);
                    return true;
                }
            }
            logger_1.Logger.log.debug("Cache.exists: Item not located in items array.");
            return false;
        }
    }
    /**
     * Removes the cache item from the array.
     * @param {string} key The key of the cache item to remove.
     */
    remove(key) {
        logger_1.Logger.log.debug("Cache.remove: start");
        if (!this.items) {
            logger_1.Logger.log.debug("Cache.remove: Items array does not exist.");
            return;
        }
        else {
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].key === key) {
                    logger_1.Logger.log.debug("Cache.remove: Item located in items array.  Removing....");
                    this.items.splice(i, 1);
                    return;
                }
            }
            logger_1.Logger.log.debug("Cache.remove: Item not located in items array.");
        }
    }
}
exports.Cache = Cache;
