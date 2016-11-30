/**
 *    cache.ts
 *    Copyright (c) 345 Systems LLP 2016, all rights reserved.
 */
import { Logger } from "../logging/logger";
import { CacheItem } from "./cache-item";
/**
 *   class Cache
 *   Represents a cache for configuration objects.
 */
export class Cache {
  public static current: Cache;
  public items: CacheItem[] = [];

  /**
   * Static constructor for the cache singleton.
   */
  public static init(): void {
    Cache.current = new Cache();
  }

  /**
   * Adds an item to the cache.
   * @param {CacheItem} item A cache item.
   */
  public add(item: CacheItem): void {

    Logger.log.trace("Cache.add: start");

    // set the expiry.
    Logger.log.trace(`Cache.add: Attempting to set the expiry from the TTL.  TTL: '${item.ttl}'`);
    if (item.ttl >= 0) {
      item.expires = new Date();
      item.expires.setTime(item.expires.getTime() + item.ttl * 1000);
      Logger.log.trace(`Cache.add: Item expiry has been set: '${item.expires}'`);
    }

    if (!this.items) {
      Logger.log.trace("Cache.add: Items array does not exist.  Creating...");
      this.items = [item];
      return;
    } else {
      for (let i: number = 0; i < this.items.length; i++) {
        if (this.items[i].key === item.key) {
          Logger.log.trace("Cache.add: Item located in items array.  Updating....");
          this.items[i] = item;
          return;
        }
      }

      Logger.log.trace("Cache.add: Item not located in items array.  Adding....");
      this.items.push(item);
      Logger.log.trace(`Cache.add: Cache contains '${this.items.length}' items.`);
    }
  }

  /**
   * Adds an item by creating the cache item then adding to the cache.
   * @param {string} key   The key.
   * @param {any}    value The item to add.
   * @param {number} revision   The item's revision number.
   * @param {number} ttl   The TTL of the item in cache.
   */
  public addItem(key: string, value: any, revision: number, ttl?: number): CacheItem {

    Logger.log.trace(`Cache.addItem: start. key: '${key}', revision: '${revision}'`);

    let existing: CacheItem = this.get(key);

    if (!existing || existing.revision < revision) {

      Logger.log.trace(`Cache.addItem: new revision '${revision}' detected, adding to cache.`);

      let cacheItem: CacheItem = new CacheItem();
      cacheItem.key = key;
      cacheItem.value = value;
      cacheItem.revision = revision;
      cacheItem.ttl = ttl;

      this.add(cacheItem);

      return cacheItem;
    } else {
      this.add(existing);
      Logger.log.trace(`Cache.addItem: no change from existing revision '${revision}', no cache update.`);
      return undefined;
    }
  }

  /**
   * Gets an item from the cache.
   * @param  {string} key The item key.
   * @return {any}        The item.
   */
  public get(key: string): any {

    Logger.log.trace("Cache.get: start");

    if (this.exists(key)) {
      for (let i: number = 0; i < this.items.length; i++) {
        if (this.items[i].key === key) {
          Logger.log.trace(`Cache.get: Item '${key}' located in items array.  Returning....`);
          if (this.items[i].isExpired()) {
            Logger.log.trace(`Cache.get: Item '${key}' has expired.`);
          }
          return this.items[i];
        }
      }
    } else {
      Logger.log.trace("Cache.get: Item not located in items array.");
      return undefined;
    }
  }

  /**
   * Checks for the existence of the item in the cache.
   * @param  {string}  key The key of the item.
   * @return {boolean}     A value indicating whether the item exists in the cache.
   */
  public exists(key: string): boolean {

    Logger.log.trace("Cache.exists: start");

    if (!this.items) {
      Logger.log.trace("Cache.exists: Items array does not exist.");
      return false;
    } else {
      for (let i: number = 0; i < this.items.length; i++) {
        if (this.items[i].key === key) {
          Logger.log.trace(`Cache.exists: Item '${key}' located in items array.`);
          return true;
        }
      }

      Logger.log.trace("Cache.exists: Item not located in items array.");
      return false;
    }
  }

  /**
   * Removes the cache item from the array.
   * @param {string} key The key of the cache item to remove.
   */
  public remove(key: string): void {

    Logger.log.trace("Cache.remove: start");

    if (!this.items) {
      Logger.log.trace("Cache.remove: Items array does not exist.");
      return;
    } else {
      for (let i: number = 0; i < this.items.length; i++) {
        if (this.items[i].key === key) {
          Logger.log.trace("Cache.remove: Item located in items array.  Removing....");
          this.items.splice(i, 1);
          return;
        }
      }

      Logger.log.trace("Cache.remove: Item not located in items array.");
    }
  }
}
